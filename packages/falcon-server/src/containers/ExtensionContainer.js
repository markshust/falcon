/* eslint-disable no-restricted-syntax, no-await-in-loop */

const { EventEmitter } = require('events');
const Logger = require('@deity/falcon-logger');
const { mergeSchemas } = require('graphql-tools');

/**
 * @typedef {object} ExtensionInstanceConfig
 * @property {string} package Node package path (example: "@deity/falcon-blog-extension")
 * @property {object} config Config object to be passed to Extension Instance constructor
 * @property {string} config.api API instance name to be used by the Extension
 */

/**
 * Holds extensions and expose running hooks for for them.
 */
module.exports = class ExtensionContainer extends EventEmitter {
  /**
   * Creates extensions container
   * @param {ExtensionInstanceConfig[]} [extensions] extensions List of extension configurations
   * @param {Map<string,ApiDataSource>} dataSources Map of API DataSources
   */
  constructor(extensions, dataSources) {
    super();
    /** @type {Map<string,Extension>} */
    this.extensions = new Map();

    this.registerExtensions(extensions, dataSources);
  }

  /**
   * Instantiates extensions based on passed configuration and registers event handlers for them
   * @param {ExtensionInstanceConfig[]} extensions List of extension configurations
   * @param {Map<string, ApiDataSource>} dataSources Map of API DataSources
   */
  registerExtensions(extensions, dataSources) {
    extensions.forEach(extension => {
      try {
        const ExtensionClass = require(extension.package); // eslint-disable-line import/no-dynamic-require
        const extensionInstance = new ExtensionClass({ config: extension.config || {}, name: extension.package });

        Logger.debug(`ExtensionContainer: "${extensionInstance.name}" added to the list of extensions`);
        const { api: apiName } = extension.config || {};
        if (apiName && dataSources.has(apiName)) {
          extensionInstance.api = dataSources.get(apiName);
        } else {
          const logMsg = apiName
            ? `API DataSource for "${extensionInstance.name}" is not defined`
            : `"${apiName}" API DataSource is not defined`;
          Logger.warn(`ExtensionContainer: ${logMsg}`);
        }
        this.extensions.set(extensionInstance.name, extensionInstance);
      } catch (ex) {
        Logger.warn(
          `ExtensionContainer: "${extension.package}" extension cannot be loaded. Make sure it is installed. Details: ${
            ex.stack
          }`
        );
      }
    });
  }

  /**
   * Initializes each registered extension (in sequence)
   * @return {undefined}
   */
  async initialize() {
    // initialization of extensions cannot be done in parallel because of race condition
    for (const [extName, ext] of this.extensions) {
      Logger.debug(`ExtensionContainer: initializing "${extName}" extension`);
      await ext.initialize();
    }
  }

  /**
   * Gets extension by its name
   * @param {string} name Extension name
   * @return {Extension} Extension instance
   */
  getExtension(name) {
    return this.extensions.get(name);
  }

  /**
   * Creates a complete configuration for ApolloServer
   * @param {Object} defaultConfig - default configuration that should be used
   * @return {Object} resolved configuration
   */
  async createGraphQLConfig(defaultConfig = {}) {
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

    for (const [extName, ext] of this.extensions) {
      if (typeof ext.getGraphQLConfig === 'function') {
        const extConfig = await ext.getGraphQLConfig();
        this.mergeGraphQLConfig(config, extConfig, extName);
      }
    }

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
    Logger.debug(`ExtensionContainer: merging "${extensionName}" extension GraphQL config`);

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
              `ExtensionContainer: "${extensionName}" extension wants to use GraphQL option "${name}" which is not supported by Falcon extensions api yet - skipping that option`
            );
            break;
        }
      }
    });
  }
};
