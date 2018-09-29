const Logger = require('@deity/falcon-logger');
const { ApiDataSource } = require('@deity/falcon-server-env');
const util = require('util');
const { CronJob } = require('cron');
const addMinutes = require('date-fns/add_minutes');
const isPlainObject = require('lodash/isPlainObject');
const camelCase = require('lodash/camelCase');
const keys = require('lodash/keys');
const isEmpty = require('lodash/isEmpty');

/**
 * Base API features (configuration fetching, response parsing, token management etc.) required for communication
 * with Magento2. Extracted to separate class to keep final class clean (only resolvers-related logic should be there).
 */
module.exports = class Magento2ApiBase extends ApiDataSource {
  /**
   * Create Magento api wrapper instance
   * @param {object} options configuration options
   * @param {string} options.apiHost api host
   * @param {string} options.apiProtocol https or http
   * @param {string} options.apiUser api user
   * @param {string} options.apiPassword api password
   * @param {string} options.apiPort api port
   */
  constructor({ config, name }) {
    super({ config, name });
    this.storePrefix = config.storePrefix || 'default';
    this.cookie = null;
    this.setupAdminTokenRefreshJob();
  }

  async preInitialize() {
    if (!this.context) {
      this.initialize({ context: {} });
    }
  }

  /**
   * Setup cronjob to check if  admin token is valid and refresh it if required
   */
  setupAdminTokenRefreshJob() {
    // run every minute
    this.refresh = new CronJob(
      '* * * * *',
      async () => {
        if (this.token && !this.isAdminTokenValid()) {
          Logger.debug('Refresh admin token');
          await this.retrieveAdminToken();
        }
      },
      null,
      true
    );
  }

  /**
   * Check if admin token is still valid
   * @returns {boolean} true if token is valid
   */
  isAdminTokenValid() {
    return !this.tokenExpirationTime || (this.tokenExpirationTime && this.tokenExpirationTime > Date.now());
  }

  /**
   * Make request to the backend for admin token
   * @returns {Promise<string>} admin token
   */
  async retrieveAdminToken() {
    Logger.info('Retrieving Magento token.');

    const response = await this.retrieveToken({ username: this.config.username, password: this.config.password });

    Logger.info('Magento token found.');
    // data available only if retrieveToken is not wrapped with cache.
    const tokenData = this.convertKeys(response.data || response);
    const { token, validTime } = tokenData;
    this.token = token;
    this.tokenExpirationTime = null;

    if (validTime) {
      // convert validTime from hours to milliseconds and subtract 5 minutes buffer
      const tokenTimeInMinutes = validTime * 60 - 5;
      const tokenExpirationTime = addMinutes(Date.now(), tokenTimeInMinutes);

      this.tokenExpirationTime = tokenExpirationTime.getTime();
      Logger.debug(`Admin token valid for ${validTime} hours, till ${tokenExpirationTime.toString()}`);
    }

    return this.token;
  }

  /**
   * Retrieve token for given user.
   * @param {string} username magento2 user
   * @param {string} password magento2 user password
   * @returns {object} response data
   */
  retrieveToken({ username, password }) {
    return this.post('/integration/admin/token', { username, password }, { context: { skipAuth: true } });
  }

  /**
   * Helper method to recursively change key naming from underscore to camelCase
   *
   * @param {*} data - argument to process
   * @return {object} - converted object
   */
  convertKeys(data) {
    // handle simple types
    if (!isPlainObject(data) && !Array.isArray(data)) {
      return data;
    }

    if (isPlainObject(data) && !isEmpty(data)) {
      const keysToConvert = keys(data);
      keysToConvert.forEach(key => {
        data[camelCase(key)] = this.convertKeys(data[key]);

        // remove snake_case key
        if (camelCase(key) !== key) {
          delete data[key];
        }
      });
    }

    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        data[index] = this.convertKeys(item);
      });
    }

    return data;
  }
  /**
   * Resolves url based on passed parameters
   * @param {object} req - request params
   * @returns {URL} resolved url object
   */
  async resolveURL(req) {
    const { path } = req;
    let { storeCode } = this.context.magento || {};
    if (storeCode) {
      req.params.delete(storeCode);
    } else {
      storeCode = this.storePrefix;
    }

    return super.resolveURL({
      path: `/rest/${storeCode}/V1${path}`
    });
  }

  /**
   * Authorize all requests, except case when authorization is explicitly disabled via context settings
   * @param {object} req - request params
   */
  async willSendRequest(req) {
    const { context } = req;
    if (!context || !context.skipAuth) {
      await this.authorizeRequest(req);
    }
  }

  async authorizeRequest(req) {
    let token;
    const { useAdminToken } = req.context || {};

    if (useAdminToken) {
      token = await this.getAdminToken();
    } else {
      const { customerToken = {} } = this.context.magento || {};
      this.validateCustomerToken(customerToken);
      token = customerToken.token || (await this.getAdminToken());
    }

    req.headers.set('Authorization', `Bearer ${token}`);
    req.headers.set('Content-Type', 'application/json');
    req.headers.set('Cookie', this.cookie);
  }

  /**
   * Check if token is still valid and throw error if it has expired
   * @param {object} customerToken - customer token data
   * @param {string} [customerToken.token] - token
   * @param {Number} [customerToken.expirationTime] - token expiration time
   * @throws Error - throw error and set status code to 401 if token has expired
   */
  validateCustomerToken(customerToken) {
    if (customerToken && customerToken.token && !this.isCustomerTokenValid(customerToken)) {
      const sessionExpiredError = new Error('Session has expired');

      sessionExpiredError.statusCode = 401;
      sessionExpiredError.code = 'CUSTOMER_TOKEN_EXPIRED';
      throw sessionExpiredError;
    }
  }

  /**
   * Check if admin token is still valid
   * @param {Object} customerTokenObject - customer token data
   * @param {String} [customerTokenObject.token] - token
   * @param {Number} [customerTokenObject.expirationTime] - token expiration time
   * @returns {boolean} - true if token is valid
   */
  isCustomerTokenValid(customerTokenObject) {
    return (
      (customerTokenObject.expirationTime && customerTokenObject.expirationTime > Date.now()) ||
      !customerTokenObject.expirationTime
    );
  }

  /**
   * Get Magento api authorized admin token or perform request to create it.
   * @return {string} token value
   */
  async getAdminToken() {
    if (!this.token) {
      if (!this.reqToken) {
        this.reqToken = this.retrieveAdminToken();
      }

      Logger.debug('Waiting for Magento token.');

      // this is called multiple times and may cause some problems with error handling
      return this.reqToken;
    }

    return this.token;
  }

  async didReceiveResponse(response) {
    const cookies = (response.headers.get('set-cookie') || '').split('; ');
    const responseTags = response.headers.get('x-cache-tags');
    const data = await super.didReceiveResponse(response);
    const meta = {};

    if (responseTags) {
      meta.tags = responseTags.split(',');
    }

    if (cookies.length) {
      // For "customer/token" API call - we don't get PHPSESSID cookie
      cookies.forEach(cookieString => {
        if (cookieString.match(/PHPSESSID=(\w+\d+)/)) {
          this.cookie = cookieString.match(/PHPSESSID=(\w+\d+)/)[0];
        }
      });
    }

    const { search_criteria: searchCriteria } = data;

    if (!searchCriteria) {
      // no search criteria in response, simply return data from backend
      return { data, meta };
    }

    const { page_size: perPage = null, current_page: currentPage = 1 } = searchCriteria;
    const { total_count: total } = data;

    // process search criteria
    const pagination = this.processPagination(total, currentPage, perPage);
    return { data: { items: data.items, filters: data.filters || [], pagination }, meta };
  }

  didEncounterError(error) {
    const customerToken = {}; // todo: get it from the session or temporary context implemented in pr#9

    // eslint-disable-next-line no-underscore-dangle
    if (!global.__DEVELOPMENT__) {
      error.message = 'Internal Server Error';
    }

    if (error.statusCode === 503) {
      error.userMessage = true;
      error.message = 'Shop is unreachable at the moment. Please try again later.';
    }

    // assume there's something wrong with the token - so UI can communicate that to end user
    if (customerToken.token && error.statusCode === 401) {
      error.code = 'CUSTOMER_TOKEN_INVALID';
    }

    if (error.responseText) {
      try {
        const errorData = JSON.parse(error.responseText);
        let { message } = errorData;
        const parameters = errorData.parameters || [];

        if (parameters.length) {
          message = util.format(message.replace(/(%\d)/g, '%s'), ...parameters);
        } else if (typeof parameters === 'object') {
          message = util.format(message.replace(/(%\w+\b)/g, '%s'), ...Object.values(parameters));
        }

        error.message = message || error.message;
      } catch (eJson) {
        Logger.debug(`Failed to parse JSON from error response: ${error.responseText}`);
      }
    }

    throw error;
  }

  /**
   * Get basic store configuration from Magento
   * @return {Promise<object>} - combined configuration
   */
  async getInfo() {
    const [storeConfigs, storeViews, storeGroups, storeWebsites] = await Promise.all([
      this.get('/store/storeConfigs'),
      this.get('/store/storeViews'),
      this.get('/store/storeGroups'),
      this.get('/store/websites')
    ]);

    const { data } = storeConfigs;
    const config = { ...data[0] };
    const {
      default_display_currency_code: baseCurrencyCode,
      locale,
      extension_attributes: extensionAttributes
    } = config;

    config.locale = locale.split('_')[0];
    const postCodes = extensionAttributes.optional_post_codes;
    const minPasswordLength = extensionAttributes.min_password_length;
    const minPasswordCharClass = extensionAttributes.min_password_char_class;
    const storeCodes = data.map(item => {
      const itemView = storeViews.data.find(view => item.code === view.code);
      const itemGroup = storeGroups.data.find(group => group.id === itemView.store_group_id);
      const itemWebsite = storeWebsites.data.find(website => itemGroup.website_id === website.id);
      const active = itemView.extension_attributes && itemView.extension_attributes.is_active;

      return {
        currency: item.default_display_currency_code,
        locale: item.locale && item.locale.split('_')[0],
        code: item.code,
        id: itemView.id,
        name: itemView.name,
        groupName: itemGroup.name,
        groupId: itemGroup.id,
        websiteName: itemWebsite.name,
        websiteId: itemWebsite.id,
        active: active !== undefined ? active : 1
      };
    });

    const activeStores = storeCodes.filter(item => item.active);

    return {
      ...config,
      stores: data,
      activeStores,
      minPasswordLength,
      minPasswordCharClass,
      baseCurrencyCode,
      postCodes
    };
  }

  createContextData(context) {
    const {
      session: { storeCode, currency, customerToken, language, cart, paypalExpressHash, orderId }
    } = context.req;

    return {
      // put required data into 'magento' property so it can be used by all the resolvers
      magento: {
        storeCode,
        currency,
        customerToken,
        language,
        cart,
        paypalExpressHash,
        orderId
      }
    };
  }
};
