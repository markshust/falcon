// TODO:
// - check if we need options and apiServer here

const EventEmitter = require('events');
const Logger = require('@deity/falcon-logger');
const { mergeSchemas } = require('graphql-tools');

/**
 * Holds extensions and expose running hooks for for them.
 * todo migrate to event based hooks
 */
module.exports = class ExtensionContainer extends EventEmitter {
  /**
   * Creates extensions container
   * @param {Object[]} [extensions] extensions to install
   * @param {Object} [options] app configuration - todo rewrite to something more scoped
   * @param {ApiServer} apiServer instance
   */
  constructor({ extensions = [], options = {}, apiServer }) {
    super();
    this.config = options;
    this.apiServer = apiServer;
    this.extensions = [];

    this.registerExtensions(extensions);
  }

  /**
   * Instantiates extensions based on passed configuration and registers even handlers for them
   * @param {Array} extensions - array with extensions configuration. Each entry should contain at least 'package'
   * prop that resolves to npm package name. Additionally it can contain 'options' object that will be
   * passed to extension constructor
   */
  registerExtensions(extensions = []) {
    const requestedExtensions = extensions.map(ext => ext.package);
    const addedExtensions = [];

    Logger.info(`Extensions to load: ${requestedExtensions}`);

    extensions.forEach(extension => {
      let ExtensionClass;

      try {
        ExtensionClass = require(extension.package); // eslint-disable-line import/no-dynamic-require
      } catch (ex) {
        Logger.warn(`Extension ${extension.package} cannot be loaded. Make sure it is installed. Details: ${ex.stack}`);
      }

      if (ExtensionClass) {
        const extensionInstance = new ExtensionClass(extension.options);
        extensionInstance.name = extension.package;
        this.extensions.push(extensionInstance);
        addedExtensions.push(extension.package);
      }
    });

    Logger.info(`Loaded extensions: ${addedExtensions}`);
  }

  /**
   * Get extension by it's name
   * @param {String} name extension name
   * @return {Object} extension instance
   */
  getExtension(name) {
    const foundExtension = this.extensions.find(extension => extension.name === name);

    if (foundExtension) {
      return foundExtension.instance;
    }
  }

  /**
   * Creates final configuration for ApolloServer
   * @param {Object} defaultConfig - default configuration that should be used
   * @return {Object} resolved configuration
   */
  createGraphQLConfig(defaultConfig) {
    const config = Object.assign(
      {
        resolvers: [],
        schemas: [],
        // contextModifiers will be used as helpers - it will gather all the context functions and we'll invoke
        // all of them when context will be created. All the results will be merged to produce final context
        contextModifiers: defaultConfig.context ? [defaultConfig.context] : []
      },
      defaultConfig
    );

    // merge allowed configurations
    this.extensions.forEach(ext => {
      if (typeof ext.getGraphQLConfig === 'function') {
        const conf = ext.getGraphQLConfig();
        this.mergeGraphQLConfig(config, conf, ext.name);
      }
    });

    // define context handler that invokes all context handlers delivered by extensions
    const { contextModifiers } = config;
    config.context = arg => {
      let ctx = {};
      contextModifiers.forEach(modifier => {
        ctx = Object.assign(ctx, typeof modifier === 'function' ? modifier(arg, ctx) : modifier);
      });
      return ctx;
    };

    config.schema = mergeSchemas({
      schemas: config.schemas,
      resolvers: config.resolvers
    });

    const { dataSources } = config;
    config.dataSources = () => dataSources;

    // remove processed fields
    delete config.contextModifiers;
    delete config.resolvers;
    delete config.schemas;

    return config;
  }

  mergeGraphQLConfig(dest, source, extensionName) {
    Object.keys(source).forEach(name => {
      const value = source[name];
      if (typeof value !== 'undefined') {
        switch (name) {
          // schema and typeDefs entries go to the same array as we'll use mergeSchemas() helper which is able to
          // merge both types
          case 'typeDefs':
            dest.schemas.push({ typeDefs: value });
            break;
          case 'schema':
          case 'schemas':
            if (Array.isArray(value)) {
              dest.schemas = dest.schemas.concat(value);
            } else {
              dest.schemas.push(value);
            }
            break;
          case 'resolvers':
            if (Array.isArray(value)) {
              dest.resolvers = dest.resolvers.concat(value);
            } else {
              dest.resolvers.push(value);
            }
            break;
          case 'context':
            dest.contextModifiers.push(value);
            break;
          case 'dataSources':
            dest.dataSources = Object.assign(dest.dataSources, value);
            break;
          default:
            // todo: consider overriding the properties that we don't have custom merge logic for yet instead of
            // skipping those
            // that would give a possibility to override any kind of ApolloServer setting but the downside is
            // that one extension could override setting returned by previous one
            Logger.warn(
              `Extension ${extensionName} wants to use GraphQL option ${name} which is not supported by Falcon extensions api yet - skipping that option`
            );
            break;
        }
      }
    });
  }

  /**
   * Run extension port async or sync way.
   * @param {String} name method name to be called on every extension instance.
   * @param {Object[]} args list of arguments for method call
   * @param {Boolean} async if run method in async manner
   * @return {Promise/void} promise or nothing in sync mode
   */
  runExtensionPoint({ name, args, async = true }) {
    if (async) {
      return Promise.each(this.extensions, extension => this.runExtensionPointSingle({ extension, name, args }));
    }

    this.extensions.forEach(extension => this.runExtensionPointSingle({ extension, name, args }));
  }

  /**
   * Run extension point on single extension.
   * @param {Object} extension instance
   * @param {String} name extension point name
   * @param {Object[]} args list of extension args
   * @return {Promise/void} promise if method is async
   */
  runExtensionPointSingle({ extension, name, args }) {
    const method = extension[name];

    if (method) {
      Logger.debug(`Running extension point ${name} on ${extension.name} extension`);
      return method.call(extension, ...args);
    }
  }
};
