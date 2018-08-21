// TODO:
// - cleanup - that's old code copied from deity-core
// - move hasErrorCode outside of this class?
// - add a way to clean the cache

const Logger = require('@deity/falcon-logger');
const clone = require('lodash/clone');
const { parse } = require('url');
// import autobind from 'autobind-decorator';
// import { parse } from 'url';
// import bodyParser from 'body-parser';
// import { prepare } from '@gramps/gramps';
// import get from 'lodash/get';
// import set from 'lodash/set';
// import isArray from 'lodash/isArray';
// import { ApolloClient } from 'apollo-client';
// import { SchemaLink } from 'apollo-link-schema';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
// import Mailer from 'lib/Mailer';
// import ApiAlgolia from './ApiAlgolia';
// import Logger from './Logger';
// import RedirectionError from './../errors/RedirectionError';
// import ApiCache from './../services/ApiCache';

/**
 * Api Server represents whole api layer that wraps apis like Magento/Wordpress.
 *
 * Works using REST (deprecated) and GraphQL.
 *
 * Features:
 *
 *  - {@link ApiCache caching} (memory, persistent, invalidation)
 *  - {@link Mailer email api}
 *  - works for client and server side rendering via {@link ApiProxy proxy}
 *
 *  Core extensions:
 *
 *  - {@link UrlExtension url}
 *
 *  Collects {@link ApiEngine#mapping endpoints} definition from every wrapped {@link ApiEngine#apis api}.
 *
 * Each endpoint describes:
 *
 *  - node api path
 *  - external api path
 *  - if cache is allowed
 *  - cache tags
 *  - custom cache key generation logic
 *  - function that resolve call with external api request
 *
 * It hooks into Express app with {@link #addRoutes routes}.
 */
// @autobind
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
    // this.cache = new ApiCache({
    //   enabled: config.useCache,
    //   backend: config.cacheBackend,
    //   whiteListTag: config.cacheTag,
    //   ttl: config.cacheDuration,
    //   host: config.cacheHost || 'localhost',
    //   port: config.cachePort,
    //   db: config.cacheDb
    // });

    this.enableGraphIQL = config.graphiql;

    // default http verb for endpoints
    this.defaultMethod = 'get';
    /**
     * Endpoints collected from extensions
     * Recommended way is to use GraphQL instead
     * @type {Array}
     */
    this.mappings = [];

    this.apis = [];
    this.registerApis(apis);
    // this.addRoutes();
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

  /**
   * Return dataSources map - api instances keyed by their names
   * @return {Object} map with available data sources
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
   * @return {Object} Api instance
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
    Logger.info(`Adding ${api.name} api to the gateway`);
    this.apis.push(api);
    if (api.getEndpoints) {
      this.addMappings(api.getEndpoints());
    }
  }

  /**
   * Find data source by namespace
   * @param {String} name Data source namespace
   * @return {Object} data source configuration
   */
  // findDataSource(name) {
  //   return this.dataSources.find(source => source.namespace === name);
  // }

  /**
   * Modify schema of existing data source.
   * @param {String} name Data source namespace
   * @param {String} content to append to data source schema
   * @param {Object[]} [resolvers] list of resolvers modifications (one of wrap or add operations)
   * @param {Object} [resolvers.replace] Replace data source resolvers completely
   * @param {Function} [resolvers.wrap] Wraps result of original resolver for example to make additional requests
   * @param {String} [resolvers.path] Path to original resolver, example: Product.qty
   * @param {Function} [resolvers.add] Replace the original resolver completely or add new resolver for field
   *  added with extend type
   */
  // modifySchema({ name, content, resolvers = [] }) {
  //   const dataSource = this.findDataSource(name);

  //   dataSource.typeDefs += content;
  //   resolvers.forEach(({ path, wrap, add, replace }) => {
  //     if (replace) {
  //       dataSource.resolvers = replace;
  //       return;
  //     }
  //     const originalResolver = get(dataSource.resolvers, path);
  //     let changedResolver;

  //     if (wrap) {
  //       changedResolver = async (...args) => {
  //         let parent;

  //         if (originalResolver) {
  //           parent = await originalResolver(...args);
  //         } else {
  //           parent = args[0];
  //         }

  //         await wrap(parent);

  //         return parent;
  //       };
  //     } else {
  //       changedResolver = add;
  //     }

  //     set(dataSource.resolvers, path, changedResolver);
  //   });
  // }

  /**
   * Attach extensions that can modify mappings, resolvers or data sources.
   * @param {ExtensionContainer} extensions app extensions
   */
  // attachExtensions(extensions) {
  //   this.extensions = extensions;

  //   extensions.runExtensionPoint({
  //     name: 'onApiInit',
  //     args: [
  //       {
  //         mappings: this.mappings,
  //         dataSources: this.dataSources,
  //         resolvers: this.resolvers,
  //         api: this
  //       }
  //     ],
  //     async: false
  //   });
  // }

  /**
   * Adds api instances based on config found.
   * Skipped when instance receives apis in {@link ApiEngine#constructor}.
   * todo move to extensions
   * @param {Object} config apis configuration
   */
  // addApisBasedOnConfig(config) {
  //   const apis = [];

  //   if (config.algolia && config.algolia.apiKey) {
  //     apis.push(new ApiAlgolia(config.algolia));
  //   }

  //   if (config.mail && config.mail.transport) {
  //     apis.push(this.createMailerApi(config));
  //   }

  //   this.apis = apis;
  // }

  /**
   * @deprecated use GraphQL instead
   * Creates pattern regexp for every endpoint.
   * @param {Object[]} mappings to add
   */
  addMappings(mappings) {
    mappings.forEach(mapping => {
      if (mapping.path instanceof RegExp) {
        mapping.pathPattern = mapping.path;
      } else {
        mapping.pathPattern = new RegExp(`^/${mapping.path}$`);
      }

      this.mappings.push(mapping);
    });
  }

  /**
   * @deprecated
   * This is untested feature
   * Creates Mailer api with email sending endpoint
   * @param {Object} config mailer configuration
   * @param {String} config.mail recipient address
   * @return {Mailer} mailer instance
   */
  // createMailerApi(config) {
  //   const templateViewPath = `${process.cwd()}/src/views/mail`;

  //   Logger.info(`Mail system has been enabled. Template path is ${templateViewPath}`);

  //   return new Mailer(config.mail, templateViewPath);
  // }

  /**
   * @deprecated
   * Add some of session variables to request params to make easier for middleware to use them.
   * @param {Object} params request params
   * @param {Object} session user session
   */
  // applySessionContext(params, session) {
  //   params.storeCode = params.storeCode || session.storeCode;
  //   params.language = params.language || session.language;
  //   params.currency = params.currency || session.currency;
  // }

  /**
   * Based on http request finds a proper external api wrapper to handle it.
   *
   * @param {String} method http verb
   * @param {String} url request url
   * @param {Object} params request params
   * @param {Object} data request data
   * @param {Object} session user session
   * @returns {Object/void} mapped cal properties or nothing if not found
   */
  mapToExternalApiCall(method, url, params = {}, data, session = {}) {
    let { pathname } = parse(url);

    pathname = pathname.replace(/^\/api/, '');

    const mapping = this.mappings.find(mappingToMatch => pathname.match(mappingToMatch.pathPattern));

    if (!mapping) {
      return;
    }

    const methods = mapping.allowedMethods || [];
    if (method === this.defaultMethod || methods.indexOf(method) !== -1) {
      params.unmappedPath = pathname;

      // api not initialized - skip
      if (mapping.api === null) {
        Logger.debug(`Api not initialized for: ${pathname}`);
        return;
      }

      // no mapping required, handled directly in api server - cache for example
      if (mapping.map === false) {
        return {
          url,
          params
        };
      }

      this.applySessionContext(params, session);

      const { api, cache, tags = [], cacheKeyModifier } = mapping;

      // endpoint custom request parsing method or default api request method
      const fn = mapping.fn || api.request;

      const externalApiPath = mapping.mappedPath || pathname;

      return {
        api,
        fn,
        cache,
        cacheKeyModifier,
        unmappedPath: params.unmappedPath,
        url,
        args: [externalApiPath, params, method, data, session],
        tags
      };
    }
  }

  /**
   * Wraps list of api methods with cache middleware.
   * Cached function can return {meta: tags: [], data: {}} to describe cache key.
   * Removes meta and expose value of top level data property as call result.
   * @param {Object} api instance
   * @param {Func[]} methods list of api to wrap with cache layer
   */
  wrapWithCache(api, methods) {
    methods.forEach(method => {
      // dirty way to get pure function name
      const methodName = method.name.replace('bound ', '');
      Logger.debug(`Wraping ${api.name}.${methodName} with cache middleware.`);
      api[methodName] = async (...params) => {
        const mappedCall = {
          api,
          params,
          tags: [methodName],
          cache: true
        };

        const cachingEnabled = this.cache.enabled;

        if (cachingEnabled) {
          const { cachedData, cached } = await this.cache.getCache(mappedCall);

          if (cached) {
            return cachedData;
          }
        }
        const response = clone(await method.call(api, ...params));

        if (!response) {
          return response;
        }
        const topLevelKeys = Object.keys(response);

        const hasDataKey = topLevelKeys.includes('data');
        const hasMetaKey = topLevelKeys.includes('meta');
        let { data } = response;

        // pass response directly if structure of response isn't one of {meta, data} or {data}
        if (!(hasDataKey && ((hasMetaKey && topLevelKeys.length === 2) || topLevelKeys.length === 1))) {
          data = response;
        }

        if (cachingEnabled) {
          const meta = response.meta || {};
          meta.tags = meta.tags || [];
          meta.tags.unshift(api.name);
          await this.cache.updateCache(mappedCall, data, meta);
        }

        return data;
      };
    });
  }

  /**
   * Finds and executes external api call based on node api url and params.
   *
   * WARNING: this method can be called from ajax http call OR directly from SSR multiple times within one http request
   *
   * @param {String} method http method
   * @param {String} path request path
   * @param {Object} params request params
   * @param {Object} data post data
   * @param {Object} session user session data
   * @param {Object} [res] Express response object Only available during SSR
   * @return {Promise} call response data
   */
  // async handleCall({ method = 'get', path, params, data = {}, session, res }) {
  //   const mappedCall = this.mapToExternalApiCall(method, path, params, data, session);

  //   if (!mappedCall) {
  //     const msg = `Unmapped endpoint ${path} or method: ${method.toUpperCase()} not allowed`;
  //     const e = new Error(msg);
  //     e.originalMessage = 'Method not allowed';
  //     e.statusCode = 404;
  //     Logger.debug(msg);

  //     throw e;
  //   }

  //   try {
  //     const { cachedData, cached = false } = await this.cache.getCache(mappedCall);

  //     if (cached) {
  //       Logger.debug(`Found data in cache for: ${mappedCall.url}`);

  //       return clone(cachedData);
  //     }

  //     return await this.executeMappedCall(mappedCall);
  //   } catch (error) {
  //     // todo include this logic in graph query processing if adyen is handled by graph at some point
  //     if (error instanceof RedirectionError) {
  //       if (res) {
  //         res.redirect(error.url);
  //       } else {
  //         throw new Error(`Unhandled redirect called on client side with
  //           redirect: ${mappedCall.url} => ${error.url}`);
  //       }
  //     } else {
  //       this.extensions.runExtensionPoint({ name: 'onError', args: [{ error, mappedCall, session }], async: false });

  //       this.handleError(error);
  //     }
  //   }
  // }

  /**
   * @deprecated
   * Handle mapped api call error.
   * @param {Error} error throwed by api wrapper (like magento2)
   */
  // handleError(error) {
  //   error.originalMessage = error.message;

  //   error.message = `Request ${error.path} failed with message:
  //         ${error.originalMessage}
  //         ${error.responseText || ''}`;

  //   if (error.statusCode === 404) {
  //     Logger.debug(`Api returned 404: ${error.message}`);
  //   }

  //   // this is handled by the client and it's not considered an internal server error to be logged
  //   // example: 404 can be normal response code in some cases and a serious error in others
  //   if (error.noLogging) {
  //     Logger.debug('Logging explicitly disabled for request error: ');
  //     Logger.debug(error);
  //     throw error;
  //   }

  //   // just to make sure error is logged even with server side rendering api failures
  //   Logger.logAndThrow(error);
  // }

  /**
   * Execute mapped api call with external api wrapper.
   * @param {Object} mappedCall {@link #mapToExternalApiCall resolved by mapper}
   * @return {Promise} response data when resolved
   */
  async executeMappedCall(mappedCall) {
    const { fn, api, cacheable, args, url } = mappedCall;

    const response = await fn.bind(api)(...args);

    const { data: responseData, meta = {} } = response;

    if (cacheable) {
      Logger.debug(`Set cache for: ${url}`);
      await this.cache.updateCache(mappedCall, responseData, meta);
    }

    return responseData;
  }

  /**
   * Enable debug log level in runtime.
   * @return {Object} empty response object
   */
  async toggleDebug() {
    const currentLevel = Logger.logLevel;
    const configLevel = this.logLevel;
    let newLevel = null;

    // Switch logLevel only if configLevel is not 'debug'
    if (configLevel !== 'debug') {
      newLevel = currentLevel !== configLevel ? configLevel : 'debug';
    }

    if (newLevel && currentLevel !== newLevel) {
      Logger.setLogLevel(newLevel);
    }

    return {};
  }

  /**
   * Executed for client-side initiated requests for {@link ApiEngine#handleCall}.
   * @param {Object} req Express request
   * @param {Object} res Express response
   */
  async route(req, res) {
    try {
      const data = await this.handleCall({
        method: req.method.toLowerCase(),
        path: req.url,
        params: req.query,
        data: req.body,
        session: req.session,
        res
      });

      res.send(data);
    } catch (error) {
      res.status(error.statusCode || 500).send({
        message: error.originalMessage || 'Internal server error',
        code: error.code
      });
    }
  }

  // async mutate() {
  //   throw new Error('Mutations not yet implemented server side.');
  // }

  /**
   * Run graph query - used server side (for example during SSR, app initialization)
   * @param {Object} query as a string or object parsed by gql tag
   * @param {Object} [variables] query variables
   * @param {Object} [context] query context
   * @return {Object} result
   */
  // async query({ query, variables, req } = {}) {
  //   if (!req.apolloClient) {
  //     req.apolloClient = this.createClient(req);
  //   }
  //   const { apolloClient, session } = req;

  //   try {
  //     const res = await apolloClient.query({
  //       query,
  //       variables
  //     });

  //     return res;
  //   } catch (e) {
  //     const { graphQLErrors: topLevelErrors } = e;

  //     if (topLevelErrors) {
  //       const { originalError } = topLevelErrors[0];

  //       const { errors } = originalError;

  //       this.logGraphErrors({ query, variables, errors });

  //       const userErrors = this.convertToUserErrors(errors);

  //       const msg = userErrors.map(({ message }) => message).join(',');

  //       const userError = new Error(msg);

  //       // mimic apollo client behaviour
  //       userError.graphQLErrors = userErrors;

  //       // run with userError to expose code and other custom error properties
  //       this.extensions.runExtensionPoint({ name: 'onError', args: [{ error: userError, session }], async: false });

  //       throw userError;
  //     }

  //     this.logGraphErrors({ query, variables, error: e });

  //     // remove possible sensitive information from error message
  //     e.message = this.getDefaultQueryErrorMessage();

  //     throw e;
  //   }
  // }

  /**
   * If error contains one of the codes provided.
   * @param {Error} error possible graph error
   * @param {String[]} codeOrCodes list of codes to check
   * @return {Boolean} if code is found
   */
  hasErrorCode(error, codeOrCodes) {
    const codes = Array.isArray(codeOrCodes) ? codeOrCodes : [codeOrCodes];

    const errors = error.graphQLErrors || error.errors;
    let errorCode;

    if (errors && errors.length === 1) {
      errorCode = errors[0].code;
    } else {
      errorCode = error.code;
    }

    if (!errorCode) {
      return false;
    }

    return codes.includes(errorCode);
  }

  //  /**
  //   * Convert internal errors to errors visible to end user.
  //   * @param {Error[]} errors from graph query execution
  //   * @return {Error[]} errors for end user
  //   */
  //  convertToUserErrors(errors) {
  //    const originalErrors = this.getOriginalErrors(errors);
  //
  //    if (__DEVELOPMENT__) {
  //      return originalErrors;
  //    }
  //    const errorMessageMasked = this.getDefaultQueryErrorMessage();
  //
  //    const userErrors = originalErrors.map(originalError => ({
  //      ...originalError,
  //      message: originalError.userMessage ? originalError.message : errorMessageMasked
  //    }));
  //
  //    return userErrors;
  //  }
  //
  //  /**
  //   * Collect original errorrs from graph errors.
  //   * @param {Error[]} errors graph errors
  //   * @return {Error[]} collection of original errors
  //   */
  //  getOriginalErrors(errors = []) {
  //    return errors.map(resolverError => resolverError.originalError || resolverError);
  //  }

  /**
   * Log relevant query errors with stack trace and query details for further debugging
   * @param {Error} errors from query execution
   * @param {Error} error generic apollo error
   * @param {String/Object} query executed
   * @param {Object} variables for query
   */
  // logGraphErrors({ errors, query, variables = {}, error }) {
  //   let errorsToLog = [];

  //   if (errors) {
  //     const originalErrors = this.getOriginalErrors(errors);

  //     // quit only if graphql errors are provided - process generic apollo errors in other case
  //     if (originalErrors.length) {
  //       errorsToLog = originalErrors.filter(originalError => !originalError.noLogging);

  //       // no relevant errors found
  //       if (errorsToLog.length === 0) {
  //         return;
  //       }
  //     }
  //   }

  //   if (errorsToLog.length === 0 && error) {
  //     errorsToLog = [error];
  //   }

  //   if (!errors && !error) {
  //     errorsToLog = [new Error('No error or errors given to log.')];
  //   }

  //   let queryBody;

  //   if (typeof query === 'object') {
  //     queryBody = query.loc.source.body;
  //   } else {
  //     queryBody = query;
  //   }

  //   Logger.error(`
  //   Request ${queryBody} failed
  //   =====================
  //   Variables: ${JSON.stringify(variables)}
  //   `);
  //   errorsToLog.forEach(Logger.error);
  // }

  /**
   * Default query error message use to masked internal errors before showing to end user.
   * @return {string} message
   */
  // getDefaultQueryErrorMessage() {
  //   return 'Failed to retrieve data.';
  // }

  /**
   * Initialize graph by:
   *
   * - adding graphql middleware
   * - optionally addding graphql interactive interface
   * - prepare schema using gramps
   *
   * @param {Object} app express
   */
  // initGraph(app) {
  //   const gramps = prepare({
  //     logger: Logger,
  //     dataSources: this.dataSources,
  //     extraContext: ({ session }) => ({ session })
  //   });

  //   // not sure how addContext is used in gramps internally, looks like extraContext is called twice for no reason
  //   // https://github.com/gramps-graphql/gramps/issues/91
  //   const { schema, context, addContext } = gramps;

  //   this.gramps = gramps;

  //   app.use(
  //     '/graphql',
  //     bodyParser.json(),
  //     addContext,
  //     graphqlExpress(req => ({
  //       formatError: error => this.formatAndLogGraphError(req, error),
  //       schema,
  //       context: context(req)
  //     }))
  //   );

  //   if (this.enableGraphIQL) {
  //     Logger.info('Enabling graphql interactive website on /graphiql path.');

  //     app.use(
  //       '/graphiql',
  //       graphiqlExpress({
  //         endpointURL: '/graphql'
  //       })
  //     );
  //   }
  // }

  /**
   * Create Apollo Client for server side usage.
   * @param {Object} req express request object
   * @return {ApolloClient<NormalizedCacheObject>} instance
   */
  // createClient(req) {
  //   const { schema, context } = this.gramps;

  //   return new ApolloClient({
  //     ssrMode: true,
  //     link: new SchemaLink({ schema, context: context(req) }),
  //     cache: new InMemoryCache({
  //       // to fix mutations where __typename was automatically added to input payload and then validity error was thrown
  //       addTypename: false
  //     }),
  //     // disable cache for now
  //     defaultOptions: {
  //       watchQuery: {
  //         fetchPolicy: 'network-only',
  //         errorPolicy: 'ignore'
  //       },
  //       query: {
  //         fetchPolicy: 'network-only',
  //         errorPolicy: 'none'
  //       }
  //     }
  //   });
  // }

  /**
   * Format and log graph error run over http and express graphql middleware.
   * Make sure no sensitive information is passed.
   *
   * error GraphQLError - generic graph error
   *  originalError Error - optional query error
   *   errors  GraphQLError[] - list of resolver errors wrapped by GraphQL
   *    originalError Error - thrown by resolver
   *
   * @param {Object} req request object
   * @param {Error} error graph error
   * @return {{message: *, code: *}} formatted error to be sent to graph client
   */
  // formatAndLogGraphError(req, error) {
  //   const {
  //     session,
  //     body: { variables }
  //   } = req;
  //   let { message } = error;
  //   let code;
  //   let originalResolverError;

  //   const { source: { body: query } = {}, originalError } = error;

  //   if (originalError) {
  //     const { errors } = originalError;

  //     this.logGraphErrors({ errors, query, error, variables });

  //     const userErrors = this.convertToUserErrors(errors);

  //     if (userErrors.length === 1) {
  //       originalResolverError = userErrors[0];
  //     } else if (userErrors.length > 1) {
  //       Logger.error(`Found ${userErrors.length} user errors on a single graph query error level.`);
  //     } else if (userErrors.length === 0 && !__DEVELOPMENT__) {
  //       message = this.getDefaultQueryErrorMessage();
  //     }
  //   } else if (!__DEVELOPMENT__) {
  //     message = this.getDefaultQueryErrorMessage();
  //   }

  //   // this error is for example thrown in resolver function and contains stack trace and properties closest to
  //   // actual external api request
  //   if (originalResolverError) {
  //     [> eslint-disable prefer-destructuring <]
  //     code = originalResolverError.code;
  //     message = originalResolverError.message;
  //     [> eslint-enable prefer-destructuring <]
  //   }

  //   this.extensions.runExtensionPoint({
  //     name: 'onError',
  //     args: [{ error: originalResolverError || error, session }],
  //     async: false
  //   });

  //   return {
  //     message,
  //     code
  //   };
  // }

  /**
   * Wait for server to initialize.
   * Make sure it is ready to process request after this phase.
   * @param {Express} app express app instance
   */
  // async init(app) {
  //   await this.cache.init();

  //   this.initGraph(app);

  //   this.addRoutes(app);
  // }

  /**
   * Add {@link #ApiCache cache} routes and wildcard route to handle all wrapped external apis.
   */
  // addRoutes() {
  //   app.get('/api/cache/clean', this.cache.handleClean);
  //   app.get('/api/cache/invalidate', this.cache.handleInvalidate);
  //   if (__DEVELOPMENT__) {
  //   app.get('/api/cache/toggle', this.cache.handleToggle);
  //   }
  // }

  /**
   * Add {@link #ApiCache cache} routes and wildcard route to handle all wrapped external apis.
   * @returns {Array} array with all routes that APIs expose
   */
  getRoutes() {
    return [
      {
        methods: 'all',
        path: '/api/*',
        handler: this.route.bind(this)
      }
    ];
  }
};
