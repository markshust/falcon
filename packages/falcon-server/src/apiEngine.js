const Logger = require('@deity/falcon-logger');

/**
 * Api Engine acts as a container for API instances:
 * - manages all the instances
 * - returns the instances as dataSources (required by Apollo Server)
 * - collects all endpoints that API classes have to handle outside GraphQL
 */
module.exports = class ApiEngine {
  /**
   * Create an instance.
   * @param {Object} config Api server configuration
   * @param {String} [config.cacheBackend = memory] (memory or mongo for persistent one)
   * @param {Boolean} [config.useCache = false] if cache is enabled
   * @param {String} [config.cacheTag] regexp pattern for cacheable keys, all cacheable if not given
   * @param {String} [config.cacheDuration = 3600] Cache time to live in seconds
   * @param {String} [config.cacheHost = localhost] Cache host (for mongo and redis)
   * @param {String} [config.cachePort] Cache port (for mongo or redis)
   * @param {String} [config.cacheDb = deity-cache] Cache db name (for mongo or redis)
   * @param {String} [config.graphiql = false] If graphql interactive tool should be enabled
   * @param {String} config.logLevel Current level of logging
   */
  constructor({ config, apis, app }) {
    this.logLevel = config.logLevel;
    this.app = app;

    /**
     * Endpoints collected from extensions
     * @type {Array}
     */
    this.endpoints = [];
    /**
     * Array with API instances
     * @type {Array}
     */
    this.apis = [];

    this.registerApis(apis);
  }

  /**
   * Instantiates apis based on passed configuration
   * @param {Array} apis - with apis configuration. Each entry should contain at least 'package' prop  that resolves
   * to npm package name. Additionally it can contain 'config' object that will be passed to api constructor
   */
  registerApis(apis = []) {
    const requestedApis = apis.map(ext => ext.name);
    const addedApis = [];

    Logger.info(`APIs to load: ${requestedApis}`);

    apis.forEach(api => {
      let ApiClass;

      try {
        ApiClass = require(api.package); // eslint-disable-line import/no-dynamic-require
      } catch (ex) {
        Logger.warn(`API ${api.package} cannot be loaded. Make sure it is installed. Details: ${ex.stack}`);
      }

      if (ApiClass) {
        const apiInstance = new ApiClass(api.options);
        apiInstance.name = api.name;
        this.add(apiInstance);
        addedApis.push(`${api.package} as ${api.name}`);
      }
    });

    Logger.info(`Loaded APIs: ${addedApis}`);
  }

  async init() {
    return Promise.all(this.apis.filter(api => typeof api.init === 'function').map(api => api.init()));
  }

  /**
   * Return dataSources map - api instances keyed by their names
   * @returns {Object} map with available data sources
   */
  getDataSources() {
    const dataSources = {};
    this.apis.forEach(api => {
      dataSources[api.name] = api;
    });
    return dataSources;
  }

  /**
   * Get api by name (for now it's just alias for get(name))
   * @param {String} name api name
   * @returns {Object} Api instance
   */
  getApiInstance(name) {
    return this.get(name);
  }

  /**
   * Get api by name.
   * @param {String} name api name
   * @return {Object} Api instance
   */
  get(name) {
    return this.apis.find(api => api.name === name);
  }

  /**
   * Adds external api with mappings and a name.
   *
   * @param {Object} api instance to add
   * @param {String} api.name Name of the api to be used with {@link ApiEngine#get}
   * @param {Func} [api.getEndpoints] Method that returns list of endpoints to add
   */
  add(api) {
    if (!api.name) {
      throw new Error(`API instance passed to ApiEnging.add() does not have "name" property. 
      Please set that property before adding the api to ApiEngine`);
    }

    Logger.info(`Adding ${api.name} api to the gateway`);
    this.apis.push(api);
    if (api.getEndpoints) {
      this.endpoints = this.endpoints.concat(api.getEndpoints());
    }
  }

  /**
   * Returns all the routes requested by APIs
   * @returns {Array} array with all routes that APIs expose
   */
  getRoutes() {
    console.log('getRoutes', this.endpoints);
    return this.endpoints;
  }
};
