const { basename } = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-session');
const { ApolloServer } = require('apollo-server-koa');
const Logger = require('@deity/falcon-logger');
const ExtensionsContainer = require('./extensions');
const ApiEngine = require('./apiEngine');
const { makeExecutableSchema } = require('graphql-tools');

const ENV = process.env.NODE_ENV || 'development';
const isDevelopment = ENV === 'development';

class FalconServer {
  constructor(conf) {
    Logger.setLogLevel(conf.logLevel);
    this.config = conf;
  }

  async init() {
    await this.initApp();
    await this.initApis();
    await this.initExtensions();
    await this.initApolloServer();
    this.registerRoutes();
  }

  initApp() {
    this.app = new Koa();
    this.app.keys = this.config.session.keys;
    delete this.config.session.keys;

    this.router = new Router();

    // todo: implement backend session store e.g. https://www.npmjs.com/package/koa-redis-session
    this.app.use(session(this.config.session || {}, this.app));

    this.app.use((ctx, next) => {
      // copy session to native Node's req object because GraphQL execution context doesn't have access to Koa's
      // context, see https://github.com/apollographql/apollo-server/issues/1551
      ctx.req.session = ctx.session;
      return next();
    });
  }

  async initApis() {
    this.apiEngine = new ApiEngine({
      apis: this.config.apis,
      app: this.app,
      config: {
        logLevel: this.config.logLevel
      }
    });
    await this.apiEngine.init();
  }

  async initExtensions() {
    this.extensions = new ExtensionsContainer({
      extensions: this.config.extensions,
      // todo: try to refactor code so ExtensionContainer doesn't need apiEngine
      apiEngine: this.apiEngine
    });
    await this.extensions.init();
  }

  // this is havy-WIP :)
  async initApolloServer() {
    const cache = this.initCacheBackend();

    // Construct a schema, using GraphQL schema language
    const schemas = [
      makeExecutableSchema({
        typeDefs: `
        type Query {
          hello: String
        }
      `
      })
    ];

    // Provide resolver functions for your schema fields
    const resolvers = {
      Query: {
        getUrl: async (_, { url }) => ({
          url,
          type: basename(url)
        })
      }
    };

    const apolloServerConfig = await this.extensions.createGraphQLConfig({
      schemas,
      resolvers,
      dataSources: this.apiEngine.getDataSources(),
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
          'request.credentials': 'include'
        }
      }
    });

    const server = new ApolloServer(apolloServerConfig);

    server.applyMiddleware({ app: this.app });
  }

  /**
   * Create instance of cache backend based on configuration ("cache" key from config)
   * @return {Object} instance of cache backend
   */
  initCacheBackend() {
    if (this.config.cache && this.config.cache.enabled) {
      try {
        const CacheBackend = require(this.config.cache.package); // eslint-disable-line import/no-dynamic-require
        return new CacheBackend(this.config.cache.options || {});
      } catch (ex) {
        Logger.error(
          `Cannot load cache backend from package ${
            this.config.cache.package
          } so Apollo Server will start without cache`
        );
      }
    }
  }

  registerRoutes() {
    const routes = this.apiEngine.getRoutes();
    routes.forEach(route => {
      (Array.isArray(route.methods) ? route.methods : [route.methods]).forEach(method => {
        this.router[method](route.path, route.handler);
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

    this.init()
      .then(() => {
        this.app.listen({ port: this.config.port }, () => {
          Logger.info(`🚀 Server ready at http://localhost:${this.config.port}`);
        });
      }, handleStartupError)
      .catch(handleStartupError);
  }
}

module.exports = FalconServer;
