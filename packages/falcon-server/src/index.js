const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-session');
const { ApolloServer } = require('apollo-server-koa');
const Logger = require('@deity/falcon-logger');
const ApiContainer = require('./containers/ApiContainer');
const ExtensionContainer = require('./containers/ExtensionContainer');

const ENV = process.env.NODE_ENV || 'development';
const isDevelopment = ENV === 'development';

class FalconServer {
  constructor(config) {
    Logger.setLogLevel(config.logLevel);
    this.config = config;
  }

  async initialize() {
    await this.initializeServerApp();
    await this.initializeExtensions();
    await this.initializeApolloServer();
    this.registerEndpoints();
  }

  /**
   * @private
   */
  initializeServerApp() {
    this.app = new Koa();
    // Set signed cookie keys (https://koajs.com/#app-keys-)
    this.app.keys = this.config.session.keys;

    this.router = new Router({ prefix: '/api/' });

    // todo: implement backend session store e.g. https://www.npmjs.com/package/koa-redis-session
    this.app.use(session((this.config.session && this.config.session.options) || {}, this.app));

    this.app.use((ctx, next) => {
      // copy session to native Node's req object because GraphQL execution context doesn't have access to Koa's
      // context, see https://github.com/apollographql/apollo-server/issues/1551
      ctx.req.session = ctx.session;
      return next();
    });
  }

  /**
   * @private
   */
  async initializeExtensions() {
    /** @type {ApiContainer} */
    this.apiContainer = new ApiContainer(this.config.apis);

    /** @type {ExtensionContainer} */
    this.extensionContainer = new ExtensionContainer(this.config.extensions, this.apiContainer.dataSources);
    await this.extensionContainer.initialize();
  }

  /**
   * @private
   */
  async initializeApolloServer() {
    const cache = this.getCacheInstance();

    const apolloServerConfig = await this.extensionContainer.createGraphQLConfig({
      dataSources: this.apiContainer.dataSources.values(),
      // inject session to graph context
      // todo: re-think that - maybe we could avoid passing session here and instead pass just required data
      // from session?
      context: ({ ctx }) => ({
        session: ctx.req.session
      }),
      cache,
      tracing: isDevelopment,
      playground: isDevelopment && {
        settings: {
          'request.credentials': 'include' // include to keep the session between requests
        }
      }
    });

    const server = new ApolloServer(apolloServerConfig);

    server.applyMiddleware({ app: this.app });
  }

  /**
   * Create instance of cache backend based on configuration ("cache" key from config)
   * @private
   * @return {Object} instance of cache backend
   */
  getCacheInstance() {
    const { enabled = false, package: pkg, options = {} } = this.config.cache || {};
    if (enabled) {
      try {
        // eslint-disable-next-line import/no-dynamic-require
        const CacheBackend = require(pkg);
        return new CacheBackend(options);
      } catch (ex) {
        Logger.error(
          `FalconServer: Cannot initialize cache backend using "${
            this.config.cache.package
          }" package, GraphQL server will operate without cache`
        );
      }
    }
  }

  /**
   * @private
   */
  registerEndpoints() {
    this.apiContainer.endpoints.forEach(endpoint => {
      (Array.isArray(endpoint.methods) ? endpoint.methods : [endpoint.methods]).forEach(method => {
        this.router[method](endpoint.path, endpoint.handler);
      });
    });

    this.app.use(this.router.routes()).use(this.router.allowedMethods());
  }

  start() {
    const handleStartupError = err => {
      Logger.error('Initialization error - cannot start the server');
      Logger.error(err.stack);
      process.exit(2);
    };

    this.initialize()
      .then(() => {
        this.app.listen({ port: this.config.port }, () => {
          Logger.info(`🚀 Server ready at http://localhost:${this.config.port}`);
        });
      }, handleStartupError)
      .catch(handleStartupError);
  }
}

module.exports = FalconServer;
