const { Extension } = require('@deity/falcon-server-env');
const Logger = require('@deity/falcon-logger');
const { extname } = require('path');

/**
 * Dynamic Route Extension extension.
 *
 * Dynamic {@link DynamicRouteExtension#fetchUrl url discovery} to connect multiple external api generated urls
 * (example: sale.html)
 * It provides back information about entity type for passed url:
 *
 * @example
 * {
 *  type: 'category',
 *  path: '/category/page/path/',
 *  id: 1
 * }
 *
 * That information can be used for fetching detailed data of that url.
 */
module.exports = class DynamicRouteExtension extends Extension {
  /**
   * Reorder handlers based on request path to boost performance,
   * for example 99% urls ending with .html are Magento generated
   *
   * @param {String} path - request path
   * @return {Object[]} list of apis that supports url method
   */
  getDynamicRouteHandlers(path) {
    return this.extensionContainer
      .getExtensionsByCriteria(ext => ext.getFetchUrlPriority && ext.getFetchUrlPriority(path) > 0)
      .sort((first, second) => first.getFetchUrlPriority(path) - second.getFetchUrlPriority(path));
  }

  /**
   *
   * @param {String} path - path to check
   * @returns {Boolean} result of the check
   */
  isExtensionAllowed(path) {
    const extension = extname(path);

    if (!extension) {
      return true;
    }

    if (!this.config.allowedExtensions.includes(extension)) {
      Logger.debug(`Resolving ${path} with 404 with extension rule. Allowed: ${this.config.allowedExtensions}.`);
      return false;
    }

    return true;
  }

  /**
   * Fetches url data from remote API. Signature of the method should the the same as signature of GraphQL resolvers
   * @param {Object} obj - result returned from parent query
   * @param {Object} args - object with arguments passed to the query
   * @param {Object} context - execution context
   * @param {Object} info - GraphQL info object
   * @return {Object} fetched and processed data
   */
  async fetchUrl(obj, args, context, info) {
    const { path } = args;

    if (!this.isExtensionAllowed(path)) {
      return;
    }

    let response;
    const resolvers = this.getDynamicRouteHandlers(path);

    /* eslint-disable no-restricted-syntax */
    /* eslint-disable no-await-in-loop */
    /* eslint-disable no-continue */

    for (const resolver of resolvers) {
      Logger.debug(`Checking ${resolver.name} api for url: "${path}"...`);

      try {
        // todo this will produce different cache keys for storeCode / blog entry combination
        //  this.api.applySessionContext(params, session);
        response = await resolver.fetchUrl(obj, args, context, info);

        if (response) {
          break;
        }
      } catch (e) {
        // get status code from ApolloExtension internals
        if (e.extensions && e.extensions.response && e.extensions.response.status === 404) {
          response = null;
        } else {
          Logger.error(`Error while fetching dynamic route info: ${e.message}`);
          throw e;
        }
      }
    }

    if (!response) {
      return null;
    }

    /* eslint-enable no-continue */
    /* eslint-enable no-await-in-loop */
    /* eslint-enable no-restricted-syntax */

    if (response) {
      response.path = path;
    }

    return response;
  }

  getGraphQLConfig() {
    return {
      schema: [
        `
        extend type Query {
            url(path: String): Url
        }

        type Url {
          id: Int!
          path: String!
          type: String!
        }
      `
      ],
      resolvers: {
        Query: {
          url: this.fetchUrl.bind(this)
        }
      }
    };
  }
};
