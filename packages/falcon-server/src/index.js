const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-session');
const { ApolloServer } = require('apollo-server-koa');
const Logger = require('@deity/falcon-logger');
const ApiContainer = require('./containers/ApiContainer');
const ExtensionContainer = require('./containers/ExtensionContainer');
const { EventEmitter2 } = require('eventemitter2');

const ENV = process.env.NODE_ENV || 'development';
const isDevelopment = ENV === 'development';

const Events = {
  ERROR: 'falcon-server.error',

  BEFORE_INITIALIZED: 'falcon-server.before-initialized',
  AFTER_INITIALIZED: 'falcon-server.after-initialized',

  BEFORE_STARTED: 'falcon-server.before-started',
  AFTER_STARTED: 'falcon-server.after-started',

  BEFORE_WEB_SERVER_CREATED: 'falcon-server.before-web-server-created',
  AFTER_WEB_SERVER_CREATED: 'falcon-server.after-web-server-created',

  BEFORE_API_CONTAINER_CREATED: 'falcon-server.before-api-container-created',
  AFTER_API_CONTAINER_CREATED: 'falcon-server.after-api-container-created',

  BEFORE_EXTENSION_CONTAINER_CREATED: 'falcon-server.before-extension-container-created',
  AFTER_EXTENSION_CONTAINER_CREATED: 'falcon-server.after-extension-container-created',
  AFTER_EXTENSION_CONTAINER_INITIALIZED: 'falcon-server.after-extension-container-initialized',

  BEFORE_APOLLO_SERVER_CREATED: 'falcon-server.before-apollo-server-created',
  AFTER_APOLLO_SERVER_CREATED: 'falcon-server.after-apollo-server-created',

  BEFORE_ENDPOINTS_REGISTERED: 'falcon-server.before-endpoints-registered',
  AFTER_ENDPOINTS_REGISTERED: 'falcon-server.after-endpoints-registered'
};

class FalconServer {
  constructor(config) {
    this.config = config;
    Logger.setLogLevel(config.logLevel);
    const { maxListeners = 20, verboseEvents = false } = this.config;

    this.eventEmitter = new EventEmitter2({
      maxListeners,
      wildcard: true,
      verboseMemoryLeak: false
    });

    if (verboseEvents) {
      this.eventEmitter.onAny(event => {
        Logger.trace(`Triggering "${event}" event listener...`);
      });
    }
  }

  async initialize() {
    await this.eventEmitter.emitAsync(Events.BEFORE_INITIALIZED, this);
    await this.initializeServerApp();
    await this.initializeExtensions();
    await this.initializeApolloServer();
    await this.registerEndpoints();
    await this.eventEmitter.emitAsync(Events.AFTER_INITIALIZED, this);
  }

  /**
   * @private
   */
  async initializeServerApp() {
    await this.eventEmitter.emitAsync(Events.BEFORE_WEB_SERVER_CREATED, this.config);
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
    await this.eventEmitter.emitAsync(Events.AFTER_WEB_SERVER_CREATED, this.app);
  }

  /**
   * @private
   */
  async initializeExtensions() {
    await this.eventEmitter.emitAsync(Events.BEFORE_API_CONTAINER_CREATED, this.config.apis);
    /** @type {ApiContainer} */
    this.apiContainer = new ApiContainer(this.config.apis);
    await this.eventEmitter.emitAsync(Events.AFTER_API_CONTAINER_CREATED, this.apiContainer);

    await this.eventEmitter.emitAsync(Events.BEFORE_EXTENSION_CONTAINER_CREATED, this.config.extensions);
    /** @type {ExtensionContainer} */
    this.extensionContainer = new ExtensionContainer(this.config.extensions, this.apiContainer.dataSources);
    await this.eventEmitter.emitAsync(Events.AFTER_EXTENSION_CONTAINER_CREATED, this.extensionContainer);

    await this.extensionContainer.initialize();
    await this.eventEmitter.emitAsync(Events.AFTER_EXTENSION_CONTAINER_INITIALIZED, this.extensionContainer);
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

    await this.eventEmitter.emitAsync(Events.BEFORE_APOLLO_SERVER_CREATED, apolloServerConfig);
    const server = new ApolloServer(apolloServerConfig);
    await this.eventEmitter.emitAsync(Events.AFTER_APOLLO_SERVER_CREATED, server);

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
  async registerEndpoints() {
    Logger.debug(`FalconServer: registering API endpoints`);
    await this.eventEmitter.emitAsync(Events.BEFORE_ENDPOINTS_REGISTERED, this.apiContainer.endpoints);
    this.apiContainer.endpoints.forEach(endpoint => {
      (Array.isArray(endpoint.methods) ? endpoint.methods : [endpoint.methods]).forEach(method => {
        this.router[method](endpoint.path, endpoint.handler);
      });
    });

    this.app.use(this.router.routes()).use(this.router.allowedMethods());
    await this.eventEmitter.emitAsync(Events.AFTER_ENDPOINTS_REGISTERED, this.router);
  }

  start() {
    const handleStartupError = err => {
      this.eventEmitter.emitAsync(Events.ERROR, err).then(() => {
        Logger.error('FalconServer: Initialization error - cannot start the server');
        Logger.error(err.stack);
        process.exit(2);
      });
    };

    this.initialize()
      .then(() => this.eventEmitter.emitAsync(Event.BEFORE_STARTED, this))
      .then(
        () =>
          new Promise(resolve => {
            this.app.listen({ port: this.config.port }, () => {
              Logger.info(`🚀 Server ready at http://localhost:${this.config.port}`);
              resolve();
            });
          }, handleStartupError)
      )
      .then(() => this.eventEmitter.emitAsync(Events.AFTER_STARTED, this))
      .catch(handleStartupError);
  }
}

module.exports = FalconServer;
module.exports.Events = Events;
