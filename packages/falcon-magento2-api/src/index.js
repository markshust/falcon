const qs = require('qs');
const isEmpty = require('lodash/isEmpty');
const pick = require('lodash/pick');
const has = require('lodash/has');
const { htmlHelpers } = require('@deity/falcon-server-env');
const isPlainObject = require('lodash/isPlainObject');
const addMinutes = require('date-fns/add_minutes');

const Logger = require('@deity/falcon-logger');
const Magento2ApiBase = require('./Magento2ApiBase');

/**
 * API for Magento2 store - provides resolvers for shop schema.
 */
module.exports = class Magento2Api extends Magento2ApiBase {
  /**
   * Fetch category data
   * @param {object} params - params with id of category
   * @return {Promise.<object>} - converted response with category data
   */
  async fetchCategory(params) {
    const { id, storeCode = '' } = params;

    const response = await this.get(`/categories/${id}`, {
      storeCode
    });

    return this.convertCategoryData(response);
  }

  /**
   * Process category data from Magento2 response
   * @param {object} response - response from Magento2 backend
   * @return {object} - processed response
   */
  convertCategoryData(response) {
    const { data } = response;

    this.convertAttributesSet(response);

    const {
      extension_attributes: extensionAttributes,
      custom_attributes: customAttributes,
      children_data: childrenData = []
    } = data;

    // for specific category record
    let urlPath = customAttributes.url_path;

    if (!urlPath) {
      // in case of categories tree - URL path can be found in data.url_path
      urlPath = data.url_path;
      delete data.url_path;
    }

    delete data.created_at;
    delete data.product_count;

    data.urlPath = urlPath && this.convertPathToUrl(urlPath);
    childrenData.map(item => this.convertCategoryData({ data: item }).data);

    if (extensionAttributes && extensionAttributes.breadcrumbs) {
      data.breadcrumbs = this.convertBreadcrumbs(extensionAttributes.breadcrumbs);
    }

    return response;
  }

  /**
   * Convert attributes from array of object into flat key-value pair,
   * where key is attribute code and value is attribute value
   * @param {object} response - response from Magento2 backend
   * @return {object} - converted response
   */
  convertAttributesSet(response) {
    const { data } = response;
    const { custom_attributes: attributes = [] } = data;
    const attributesSet = {};

    if (Array.isArray(attributes)) {
      attributes.forEach(attribute => {
        attributesSet[attribute.attribute_code] = attribute.value;
      });

      data.custom_attributes = attributesSet;
    }

    return response;
  }

  /**
   * Add suffix to path
   * @param {string} path - path to convert
   * @return {string} - converted path
   * @todo get suffix from Magento2 config
   */
  convertPathToUrl(path) {
    return `${path}.html`;
  }

  /**
   * Convert breadcrumbs for category, product entities
   * @param {array} breadcrumbs an array of breadcrumbs from Magento
   * @returns {array} | converted breadcrumbs
   */
  convertBreadcrumbs(breadcrumbs = []) {
    return breadcrumbs.map(item => {
      item.name = htmlHelpers.stripHtml(item.name);
      item.urlPath = this.convertPathToUrl(item.urlPath);
      item.urlKey = item.urlKey;
      item.urlQuery = null;
      if (item.urlQuery && Array.isArray(item.urlQuery)) {
        // since Magento2.2 we are no longer able to send arbitrary hash, it gets converted to JSON string
        const filters = typeof item.urlQuery[0] === 'string' ? JSON.parse(item.urlQuery[0]) : item.urlQuery[0];
        item.urlQuery = { filters };
      }

      if (item.urlQuery) {
        item.urlPath += `?${qs.stringify(item.urlQuery)}`;
      }

      return item;
    });
  }

  /**
   * Get list of products based on filters from params
   * @param {object} params - request params
   * @param {string} [params.storeCode] - store code
   * @return {Promise<object>} - response with list of products
   */
  async fetchProducts(params) {
    const { filters: simpleFilters = [], categoryId, skus } = params;
    // params.filters =  contains "simple" key-value filters (will be transpiled to Magento-like filters)
    const filtersToCheck = {};

    if (simpleFilters.length) {
      simpleFilters.forEach(item => {
        filtersToCheck[item.field] = item.value;
      });
    }

    if (categoryId) {
      filtersToCheck.category_id = categoryId;
    }

    // remove filters which are not in format acceptable by Magento
    params.filters = [];

    Object.keys(filtersToCheck).forEach(key => {
      if (filtersToCheck[key]) {
        this.addSearchFilter(params, key, filtersToCheck[key]);
      }
    });

    if (skus) {
      this.addSearchFilter(params, 'sku', skus.join(','), 'in');
    }

    return this.fetchProductList(params);
  }

  /**
   * Include field to list of filters. Used when making request to listing endpoint.
   * @param {Object} params - request params
   * @param {String} field - filter field to include
   * @param {*} value - field value
   * @param {String} conditionType - condition type of the filter
   * @return {Object} - request params with additional filter
   */
  addSearchFilter(params = {}, field, value, conditionType = 'eq') {
    params.filters = isEmpty(params.filters) ? [] : params.filters;

    params.filters.push({
      filters: [
        {
          condition_type: conditionType,
          field,
          value
        }
      ]
    });

    return params;
  }

  /**
   * Fetch list of products
   * @param {Object} params - request params
   * @returns {Promise<Object>} - list of product items
   */
  fetchProductList(params = {}) {
    /**
     * Magento visibility settings
     *
     * VISIBILITY_NOT_VISIBLE = 1;
     * VISIBILITY_IN_CATALOG = 2;
     * VISIBILITY_IN_SEARCH = 3;
     * VISIBILITY_BOTH = 4;
     */
    this.addSearchFilter(params, 'visibility', '2,4', 'in');

    if (!this.isFilterSet('status', params)) {
      this.addSearchFilter(params, 'status', '1');
    }

    // removed virtual products as we're not supporting it - feature request: RG-1086
    this.addSearchFilter(params, 'type_id', 'simple,configurable,bundle', 'in');

    return this.fetchList('/products', params);
  }

  /**
   * Check if given filter is set in params
   * @param {String} filterName - Name of the filter
   * @param {Object} params - Params with filters
   * @return {boolean} if filter is set
   */
  isFilterSet(filterName, params = {}) {
    const { filters = [] } = params || {};

    return filters.some(({ filters: filterItems = [] }) =>
      filterItems.some(filterItem => filterItem.field === filterName)
    );
  }

  /**
   * Generic method for endpoints handling category listing
   * @param {String} path - path to magento api endpoint
   * @param {Object} params - request params
   * @param {String} params.currency - selected currency
   * @param {Object[]} params.filters - filters for the collection
   * @param {Boolean} params.includeSubcategories - use subcategories in the search flag
   * @param {Object} params.query - request query params
   * @param {Number} params.query.page - pagination page
   * @param {Number} params.query.perPage - number of items per page
   * @param {Object[]} params.sortOrders - list of sorting parameters
   * @param {String} params.storeCode - request params
   * @param {String[]} params.withAttributeFilters - list of attributes for layout navigation
   * @return {Promise<Object>} - response from endpoint
   */
  async fetchList(path, params) {
    const {
      query: { page = 1, perPage } = {},
      filters: filterGroups = [],
      includeSubcategories = false,
      withAttributeFilters = [],
      sortOrders = {},
      currency,
      storeCode
    } = params;
    const searchCriteria = {
      sortOrders,
      currentPage: Number(page),
      filterGroups
    };

    if (perPage) {
      // most list endpoints require int or no param in the request; null will not work
      searchCriteria.pageSize = perPage;
    }

    if (sortOrders.length) {
      searchCriteria.sortOrders = sortOrders;
    }

    const response = await this.get(
      path,
      {
        includeSubcategories,
        withAttributeFilters,
        searchCriteria
      },
      { context: { storeCode } }
    );

    return this.convertList(response, currency);
  }

  /**
   * Process data from listing endpoint
   * @param {Object} response - response from Magento2 backend
   * @param {String} currency - selected currency
   * @return {Object} - processed response
   */
  convertList(response = {}, currency = null) {
    const {
      data: { items = [] },
      data: { custom_attributes: attributes }
    } = response;

    if (attributes) {
      this.convertProductData(response, currency);
    }

    items.forEach(element => {
      // If product
      if (element.sku) {
        this.convertProductData({ data: element }, currency);
      }

      // If category
      if (element.level) {
        this.convertCategoryData({ data: element });
      }
    });

    return response;
  }

  /**
   * Process product data from Magento2 response
   * @param {Object} response - reponse from Magento2 backend
   * @param {String} currency - selected currency
   * @return {Object} - processed response
   */
  convertProductData(response, currency = null) {
    this.convertAttributesSet(response);
    let { data } = response;
    data = this.convertKeys(data);
    const { extensionAttributes = {}, customAttributes } = data;
    const catalogPrice = extensionAttributes.catalogDisplayPrice;
    const price = catalogPrice || data.price;

    data.urlPath = this.convertPathToUrl(customAttributes.urlKey);
    data.priceAmount = data.price;
    data.currency = currency;
    data.price = price;
    data.name = htmlHelpers.stripHtml(data.name);
    data.priceType = customAttributes.priceType || '1';

    if (extensionAttributes && !isEmpty(extensionAttributes)) {
      const {
        breadcrumbs,
        thumbnailUrl,
        mediaGallerySizes,
        stockItem,
        minPrice,
        maxPrice,
        configurableProductOptions,
        bundleProductOptions
      } = extensionAttributes;

      if (breadcrumbs) {
        data.breadcrumbs = this.convertBreadcrumbs(breadcrumbs);
      }

      data.thumbnail = thumbnailUrl;
      data.gallery = mediaGallerySizes;

      if (minPrice) {
        data.minPrice = minPrice;
        delete extensionAttributes.minPrice;
      }

      if (maxPrice) {
        data.maxPrice = maxPrice;
        delete extensionAttributes.maxPrice;
      }

      if (data.minPrice && price === 0) {
        data.price = data.minPrice;
      }

      if (data.minPrice === data.maxPrice) {
        delete data.minPrice;
        delete data.maxPrice;
      }

      if (stockItem) {
        data.stock = pick(stockItem, 'qty', 'isInStock');
      }

      data.configurableOptions = configurableProductOptions || [];

      if (bundleProductOptions) {
        // remove extension attributes for option product links
        bundleProductOptions.forEach(option => {
          const reducedProductLink = option.productLinks.map(productLink => ({
            ...productLink,
            ...productLink.extensionAttributes
          }));
          option.productLinks = reducedProductLink;
        });

        data.bundleOptions = bundleProductOptions;
      }
    }

    if (customAttributes && !isEmpty(customAttributes)) {
      const { description, metaTitle, metaDescription, metaKeyword } = customAttributes;

      data.description = description;

      data.seo = {
        title: metaTitle,
        description: metaDescription,
        keywords: metaKeyword
      };
    }

    return response;
  }

  /**
   * Special endpoint to fetch any magento entity by it's url, for example product, cms page
   * @param {Object} params - request params
   * @param {String} [params.path] - request path to be checked against api urls
   * @param {Boolean} [params.loadEntityData] - flag to mark whether endpoint should return entity data as well
   * @return {Promise} - request promise
   */
  async fetchUrl(params) {
    const { currency, storeCode, path, loadEntityData = false } = params;

    return this.get(
      '/url/',
      {
        request_path: path,
        load_entity_data: loadEntityData
      },
      {
        context: {
          storeCode,
          didReceiveResult: result => this.reduceUrl(result, currency)
        }
      }
    );
  }

  /**
   * Reduce url endpoint data.
   * Find entity reducer and use it.
   *
   * @param {Object} data - parsed response Api Response
   * @param {String} [currency=null] currency code
   * @return {Object} reduced data
   */
  reduceUrl(data, currency = null) {
    const type = data.entity_type;
    const entityData = data[type.replace('-', '_')];
    // unify the types so client receives 'shop-page, 'shop-product', 'shop-category, etc.
    const unifiedType = `shop-${type.replace('cms-', '')}`;

    if (entityData === null) {
      return { id: data.entity_id, type: unifiedType };
    }

    let reducer;

    if (type === 'cms-page') {
      reducer = this.reduceCmsPage;
    } else if (type === 'product') {
      reducer = this.reduceProduct;
    } else if (type === 'category') {
      reducer = this.reduceCategory;
    } else {
      throw new Error(`Unknown url entity type: ${type} in magento api.`);
    }

    const reducedEntityData = reducer.call(this, { data: entityData }, currency);

    return Object.assign(reducedEntityData.data, { type: unifiedType });
  }

  /**
   * Reduce cms page data
   * @param {Object} response - full api response
   * @return {Object} - reduced response
   */
  reduceCmsPage(response) {
    const { data } = response;
    const { title, id } = data;
    let { content } = data;

    content = this.replaceLinks(content);
    response.data = { id, content, title };

    return response;
  }

  /**
   * Reduce product data to what is needed.
   * @param {Object} response - api response
   * @param {String} [currency=null] - currency code
   * @return {Object} - reduced data
   */
  reduceProduct(response, currency = null) {
    this.convertProductData(response, currency);

    return response;
  }

  /**
   * Reduce category data
   * @param {Object} response - api response
   * @return {Object} reduced data
   */
  reduceCategory(response) {
    this.convertCategoryData(response);

    return response;
  }

  /**
   * Search for product with id
   * @param {number} id = product id called by magento entity_id
   * @return {Object} - product data
   */
  async fetchProduct({ id, storeCode, currency }) {
    const urlPath = `catalog/product/view/id/${id}`;

    return this.fetchUrl({ path: urlPath, loadEntityData: true, storeCode, currency });
  }

  /**
   * Add product to cart
   *
   * @param {Object} input - product data
   * @param {String} input.sku - added product sku
   * @param {Number} input.qty - added product qty
   * @param {Object} params - request params
   * @param {Object} params.customerToken - customer token
   * @param {String} params.storeCode - selected store code
   * @param {String} params.currency - current customer currency
   * @return {Promise<Object>} - cart item data
   */
  async addToCart(input, params = {}) {
    const { storeCode, customerToken = {} } = params;

    const cartData = await this.ensureCart(params);
    const cartPath = this.getCartPath(params);

    const product = {
      cart_item: {
        sku: input.sku,
        qty: input.qty,
        quote_id: cartData.quoteId
      }
    };

    if (input.configurableOptions) {
      product.cart_item.product_option = {
        extension_attributes: {
          configurable_item_options: input.configurableOptions.map(item => ({
            option_id: item.optionId,
            option_value: item.value
          }))
        }
      };
    }

    if (input.bundleOptions) {
      product.cart_item.product_option = {
        extension_attributes: {
          bundle_options: input.bundleOptions
        }
      };
    }

    try {
      const { data: cartItem } = await this.post(`${cartPath}/items`, product, {
        context: {
          storeCode,
          customerToken
        }
      });

      this.convertKeys(cartItem);
      this.processPrice(cartItem, ['price']);

      return cartItem;
    } catch (e) {
      // Pass only helpful message to end user
      if (e.statusCode === 400) {
        // this is working as long as Magento doesn't translate error message - which seems not the case as of 2.2
        if (e.message.match(/^We don't have as many/)) {
          e.code = 'STOCK_TOO_LOW';
          e.userMessage = true;
          e.noLogging = true;
        }
      }

      throw e;
    }
  }

  /**
   * Ensure customer has cart in the session.
   * Creates if not exists.
   * @param {Object} session - sessions
   * @param {String} session.cart - cart data
   * @param {(String|Number)} session.cart.quoteId - cart id
   * @param {String} session.customerToken - customer token
   * @returns {Object} - new cart data
   */
  async ensureCart(session) {
    const { cart, customerToken: { token } = {} } = session;

    if (cart && cart.quoteId) {
      return cart;
    }

    const shouldUseCustomerToken = Boolean(token);
    const cartPath = token ? '/carts/mine' : '/guest-carts';
    const response = await this.forwardAction(cartPath, {}, 'post', {}, session, shouldUseCustomerToken);

    session.cart = { quoteId: response.data };

    return session.cart;
  }

  /**
   * Forward action with common magento api params.
   * @param {String} path Api path
   * @param {Object} params Api params
   * @param {String} method Api method
   * @param {Object} [data] Api data
   * @param {Object} session session content
   * @param {Boolean} [shouldUseCustomerToken = false] if customer token should be used
   * @return {Promise} Api request promise
   */
  async forwardAction(path, params, method, data, session, shouldUseCustomerToken = false) {
    const { storeCode, customerToken = {} } = session;
    const customer = {};

    if (shouldUseCustomerToken) {
      customer.customerToken = customerToken;
    }

    return this[method](path, method === 'get' ? {} : data, {
      context: {
        storeCode,
        ...customer
      }
    });
  }

  /**
   * Generate prefix for path to cart
   * @param {Object} session - session data
   * @param {Object} session.cart - current cart data
   * @param {(String|Number)} session.cart.quoteId - cart id
   * @param {String} session.customerToken - customer token
   * @returns {string} - prefix for cart endpoints
   */
  getCartPath(session) {
    const { cart, customerToken = {} } = session;

    if (!customerToken.token && !cart) {
      throw new Error('No cart in session for not registered user.');
    }

    return customerToken.token ? '/carts/mine' : `/guest-carts/${cart.quoteId}`;
  }

  /**
   * Make sure price fields are float
   * @param {Object} object - object to process
   * @param {Array.<String>} fieldsToProcess - array with field names
   * @return {Object} - updated object
   */
  processPrice(object = {}, fieldsToProcess = []) {
    fieldsToProcess.forEach(field => {
      object[field] = parseFloat(object[field]);
    });

    return object;
  }

  /**
   * Get cart data
   * @param {Object} params - data for the cart request
   * @return {Promise<Object>} - customer cart data
   */
  async fetchCart(params) {
    const { storeCode, customerToken = {} } = params;
    const quoteId = params.cart && params.cart.quoteId;

    if (!quoteId) {
      throw Error('Trying to fetch cart data without quoteId param');
    }

    // todo avoid calling both endpoints if not necessary
    const cartPath = this.getCartPath(params);
    const [{ data: quote }, { data: totals }] = await Promise.all([
      this.get(
        cartPath,
        {},
        {
          context: { storeCode, customerToken, didReceiveResult: result => this.convertKeys(result) }
        }
      ),
      this.get(
        `${cartPath}/totals`,
        {},
        {
          context: { storeCode, customerToken, didReceiveResult: result => this.convertKeys(result) }
        }
      )
    ]);

    // return this.convertCartData(deepCopy(quote), deepCopy(totals));
    return this.convertCartData(quote, totals);
  }

  /**
   * Process and merge cart and totals response
   *
   * @param {Object} quoteData - data from cart endpoint
   * @param {Object} totalsData - data from cart totals endpoint
   * @return {Object} - object with merged data
   */
  convertCartData(quoteData, totalsData) {
    quoteData.active = quoteData.isActive;
    quoteData.virtual = quoteData.isVirtual;
    quoteData.quoteCurrency = totalsData.quoteCurrencyCode;
    quoteData.couponCode = totalsData.couponCode;

    // prepare totals
    quoteData.totals = totalsData.totalSegments.map(segment => ({
      ...this.processPrice(segment, ['value'], quoteData.quoteCurrency)
    }));

    // merge items data
    quoteData.items = quoteData.items.map(item => {
      const totalsDataItem = totalsData.items.find(totalDataItem => totalDataItem.itemId === item.itemId);
      const { extensionAttributes } = totalsDataItem;
      delete totalsDataItem.extensionAttributes;

      this.processPrice(
        totalsDataItem,
        [
          'price',
          'priceInclTax',
          'rowTotalInclTax',
          'rowTotalWithDiscount',
          'taxAmount',
          'discountAmount',
          'weeeTaxAmount'
        ],
        quoteData.quoteCurrency
      );

      extensionAttributes.availableQty = parseFloat(extensionAttributes.availableQty);

      item.link = `/${extensionAttributes.urlKey}.html`;

      if (totalsDataItem.options) {
        totalsDataItem.itemOptions =
          typeof totalsDataItem.options === 'string' ? JSON.parse(totalsDataItem.options) : totalsDataItem.options;
      }

      return { ...item, ...totalsDataItem, ...extensionAttributes };
    });

    return quoteData;
  }

  /**
   * Fetch country data
   * @param {String} storeCode - store code
   * @return {Promise<Object>} - parsed country list
   */
  async fetchCountries(storeCode) {
    const path = '/directory/countries';
    const response = await this.forwardAction(path, {}, 'get', {}, { storeCode });

    const countries = response.data.map(item => ({
      code: item.id,
      englishName: item.full_name_english,
      localName: item.full_name_locale,
      regions: item.available_regions || []
    }));

    return { items: countries };
  }

  /**
   * Make request for customer token
   * @param {Object} data - form data
   * @param {String} data.email - user email
   * @param {String} data.password - user password
   * @param {Object} session - session object
   * @returns {Promise<boolean>} true if login was successful
   */
  async signIn(data, session) {
    const { email, password } = data;
    const { storeCode, cart: { quoteId = null } = {} } = session;

    try {
      const response = await this.post(
        '/integration/customer/token',
        {
          username: email,
          password,
          guest_quote_id: quoteId
        },
        {
          context: {
            storeCode
          }
        }
      );

      // depending on deity-magento-api module response may be a string with token (up until and including v1.0.1)
      // or a hash with token and valid time setting (after v1.0.1)
      const { token, validTime } = isPlainObject(response.data)
        ? this.convertKeys(response.data)
        : { token: response.data };
      const customerTokenObject = { token };

      if (validTime) {
        // calculate token expiration date and subtract 5 minutes for margin
        const tokenTimeInMinutes = validTime * 60 - 5;
        const tokenExpirationTime = addMinutes(Date.now(), tokenTimeInMinutes);

        // save expiration time as unix timestamp in milliseconds
        customerTokenObject.expirationTime = tokenExpirationTime.getTime();
        Logger.debug(`Customer token valid for ${validTime} hours, till ${tokenExpirationTime.toString()}`);
      }
      session.customerToken = customerTokenObject;

      // Remove guest cart. Magento merges guest cart with cart of authorized user so we'll have to refresh it
      delete session.cart;
      // make sure that cart is correctly loaded for signed in user
      await this.ensureCart(session);

      // true when user signed in correctly
      return true;
    } catch (e) {
      // todo: use new version of error handler
      // wrong password or login is not an internal error.
      if (e.statusCode === 401) {
        // todo: this is how old version of the extension worked - it needs to be adapted to the new way of error handling
        e.userMessage = true;
        e.noLogging = true;
      }
      throw e;
    }
  }

  /**
   * Log out customer.
   * todo revoke customer token using Magento api
   * @param {Object} session - session object
   * @returns {Promise<boolean>} true
   */
  async signOut(session) {
    /* Remove logged in customer data */
    delete session.customerToken;
    delete session.cart;

    return true;
  }

  /**
   * Create customer account
   * @param {Object} data - registration form data
   * @param {String} data.email - customer email
   * @param {String} data.firstname - customer first name
   * @param {String} data.lastname - customer last name
   * @param {String} data.password - customer password
   * @param {Object} params - request params
   * @param {String} params.storeCode - current store code
   * @param {Object} params.cart - customer cart
   * @param {(String|Number)} params.cart.quoteId - cart id
   * @returns {Promise<Object>} - new customer data
   */
  async signUp(data, params) {
    const { email, firstname, lastname, password } = data;
    const { storeCode, cart: { quoteId = null } = {} } = params;
    const customerData = {
      customer: {
        email,
        firstname,
        lastname,
        extension_attributes: {
          guest_quote_id: quoteId
        }
      },
      password
    };

    try {
      return this.post('/customers', customerData, {
        context: {
          storeCode,
          didReceiveResult: result => this.convertKeys(result)
        }
      });
    } catch (e) {
      // todo: use new version of error handler

      // code 400 is returned if password validation fails or given email is already registered
      if (e.statusCode === 400) {
        e.userMessage = true;
        e.noLogging = true;
      }
      throw e;
    }
  }

  /**
   * Fetch customer data
   * @param {Object} params - object with storeCode and customerToken
   * @return {Promise.<Object>} - converted customer data
   */
  async fetchCustomer(params) {
    const { storeCode, customerToken = {} } = params;

    if (!customerToken.token) {
      throw new Error('Customer token is required.');
    }

    const response = await this.get(
      '/customers/me',
      {},
      {
        context: {
          storeCode,
          customerToken
        }
      }
    );

    const convertedData = this.convertKeys(response.data);
    convertedData.addresses = convertedData.addresses.map(addr => this.convertAddressData(addr));

    const { extensionAttributes = {} } = convertedData;
    if (!isEmpty(extensionAttributes)) {
      delete convertedData.extensionAttributes;
    }

    return { ...convertedData, ...extensionAttributes };
  }

  convertAddressData(response) {
    response = this.convertKeys(response);

    if (!has(response, 'defaultBilling')) {
      response.defaultBilling = false;
    }

    if (!has(response, 'defaultShipping')) {
      response.defaultShipping = false;
    }

    if (isPlainObject(response.region)) {
      response.region = response.region.region;
    }

    return response;
  }

  /**
   * Fetch collection of customer orders
   * @param {Object} params - request params
   * @param {Object} params.query - request query params
   * @param {Number} params.query.page - pagination page
   * @param {Number} params.query.perPage - number of items per page
   * @returns {{data, meta}|*} - array of order items
   */
  async fetchOrders(params) {
    const {
      query: { page, perPage },
      storeCode,
      customerToken = {}
    } = params;

    if (!customerToken.token) {
      throw new Error('Trying to fetch customer orders without valid customer token');
    }

    const searchCriteria = {
      currentPage: page,
      sortOrders: [
        {
          field: 'created_at',
          direction: 'desc'
        }
      ]
    };

    if (perPage) {
      searchCriteria.pageSize = perPage;
    }

    const response = await this.get(
      '/orders/mine',
      { searchCriteria },
      {
        context: {
          storeCode,
          customerToken
        }
      }
    );

    return this.convertKeys(response.data);
  }

  /**
   * Fetch info about customer order based on order id
   * @param {Object} params - request params
   * @param {String} params.customerToken - customer token
   * @param {String} params.currency - selected currency
   * @param {Object} params.query - request query params
   * @param {Number} params.query.id - order id
   * @param {String} params.storeCode - request params
   * @returns {Promise<{Object}>} - order info
   */
  async fetchOrderById(params) {
    const { storeCode, customerToken = {}, id } = params;

    if (!id) {
      Logger.error('Trying to fetch customer order info without order id');
      throw new Error('Failed to load an order.');
    }

    if (!customerToken.token) {
      Logger.error('Trying to fetch customer order info without customer token');
      throw new Error('Failed to load an order.');
    }

    const result = this.get(
      `/orders/${id}/order-info`,
      {},
      {
        context: {
          storeCode,
          customerToken
        }
      }
    );

    return this.convertOrder(result);
  }

  /**
   * Process customer order data
   * @param {Object} response - response from Magento2 backend
   * @return {Object} - processed response
   */
  convertOrder(response) {
    const { data } = response;

    if (!data || isEmpty(data)) {
      return response;
    }

    response.data = this.convertKeys(response.data);
    response.data.items = this.convertItemsResponse(data.items);
    response = this.convertTotals(response);

    const { extensionAttributes, payment } = data;

    if (extensionAttributes) {
      response.data.shippingAddress = extensionAttributes.shippingAddress;
      delete response.data.extensionAttributes;
    }

    if (payment && payment.extensionAttributes) {
      response.data.paymentMethodName = payment.extensionAttributes.methodName;
      delete response.data.payment;
    }

    return response.data;
  }

  /**
   * Update magento items collection response
   *
   * @param {Array} response - products bought
   * @return {Array} - converted items
   */
  convertItemsResponse(response = []) {
    const products = response.filter(item => item.productType === 'simple');

    return products.map(item => {
      // If product is configurable ask for parent_item price otherwise price is equal to 0
      const product = item.parentItem || item;

      product.itemOptions = product.options ? JSON.parse(product.options) : [];
      product.qty = product.qtyOrdered;
      product.rowTotalInclTax = product.basePriceInclTax;
      product.link = `/${product.extensionAttributes.urlKey}.html`;
      product.thumbnailUrl = product.extensionAttributes.thumbnailUrl;

      return product;
    });
  }

  /**
   * Process cart totals data
   * @param {Object} response - totals response from Magento2 backend
   * @return {Object} - processed response
   */
  convertTotals(response) {
    let totalsData = response.data;

    totalsData = this.convertKeys(totalsData);

    const { totalSegments } = totalsData;

    if (totalSegments) {
      const discountIndex = totalSegments.findIndex(item => item.code === 'discount');

      // todo: Remove it and manage totals order in m2 admin panel
      if (discountIndex !== -1) {
        const discountSegment = totalSegments[discountIndex];

        totalSegments.splice(discountIndex, 1);
        totalSegments.splice(1, 0, discountSegment);
      }
    }

    return response;
  }

  /**
   * Update items in cart
   * @param {Object} input - cart item data
   * @param {String} [input.sku] - item sku
   * @param {Number} [input.qty] - item qty
   * @param {Object} params - request params
   * @param {String} [params.customerToken] - customer token
   * @param {String} [params.storeCode] - selected store code
   * @param {Object} [params.cart] - customer cart
   * @param {(String|Number)} [params.cart.quoteId] - cart id
   * @return {{data, meta}|*} - updated item data
   */
  async updateCartItem(input, params = {}) {
    const { storeCode, cart = {}, customerToken } = params;
    const { quoteId } = cart;
    const { itemId, sku, qty } = input;

    const cartPath = this.getCartPath(params);

    if (!quoteId) {
      throw new Error('Trying to update cart item without quoteId');
    }

    const data = {
      cartItem: {
        quote_id: quoteId,
        sku,
        qty: parseInt(qty, 10)
      }
    };

    const { data: cartItem } = await this.put(`${cartPath}/items/${itemId}`, data, {
      context: {
        storeCode,
        customerToken
      }
    });

    this.convertKeys(cartItem);
    this.processPrice(cartItem, ['price']);

    return cartItem;
  }

  /**
   * Remove item from cart
   * @param {Object} input - cart item data
   * @param {String} [input.itemId] - item id
   * @param {Object} params - request params
   * @param {String} [params.customerToken] - customer token
   * @param {String} [params.storeCode] - selected store code
   * @param {Object} [params.cart] - customer cart
   * @param {(String|Number)} [params.cart.quoteId] - cart id
   * @returns {{data, meta}|*} - true on success
   */
  async removeCartItem(input, params) {
    const { itemId } = input;
    const cartPath = this.getCartPath(params);
    const { storeCode, customerToken = {} } = params;

    if (params.cart && params.cart.quoteId) {
      const result = await this.delete(
        `${cartPath}/items/${itemId}`,
        {},
        {
          context: {
            storeCode,
            customerToken
          }
        }
      );

      return result.data;
    }

    Logger.warn('Trying to remove cart item without quoteId');

    return false;
  }

  async editCustomerData(data, session) {
    const { storeCode, customerToken = {} } = session;

    const response = await this.put(
      '/customers/me',
      { customer: { ...data } },
      {
        context: {
          storeCode,
          customerToken
        }
      }
    );

    return this.convertKeys(response.data);
  }

  /**
   * Request address management action
   * @param {Object} params - request params
   * @param {String} params.customerToken - customer token
   * @param {Number} params.id - address id
   * @param {String} params.storeCode - selected store code
   * @param {String} params.path - REST API path where default path is 'customers/me/address'
   * @param {String} params.method - request method, where default method is 'get'
   * @returns {{data, meta}|*} - address data, list of addresses or true after successful delete
   */
  async forwardAddressAction(params = {}) {
    const { id, storeCode, customerToken = {}, path = '/customers/me/address', method = 'get', data = null } = params;

    let addressPath = path;
    let addressData = data;

    if (!customerToken.token) {
      Logger.error('Trying to edit customer data without customer token');
      throw new Error('You do not have an access to edit address data');
    }

    if (id) {
      addressPath = `${path}/${id}`;
    }

    if (method !== 'get' && method !== 'delete') {
      addressData = {
        address: {
          ...data,
          street: Array.isArray(data.street) ? data.street : [data.street]
        }
      };
    }

    const response = await this[method](addressPath, method === 'get' || method === 'delete' ? null : addressData, {
      context: {
        storeCode,
        customerToken
      }
    });

    if (method !== 'delete') {
      return this.convertAddressData(response.data);
    }

    return response.data;
  }

  /**
   * Change customer password
   * @param {Object} params - request params
   * @param {String} params.storeCode - current store code
   * @param {String} params.customerToken - customer token
   * @param {String} method - request method
   * @param {String} params.password - new password
   * @param {String} params.currentPassword - current password
   * @returns {Promise<*>} true on success
   */
  async changeCustomerPassword(params) {
    const {
      data: { password: newPassword, currentPassword },
      storeCode,
      customerToken = {}
    } = params;

    if (!customerToken.token) {
      Logger.error('Trying to edit customer data without customer token');
      throw new Error('You do not have an access to edit account data');
    }

    try {
      const result = await this.put(
        '/customers/me/password',
        { currentPassword, newPassword },
        {
          context: {
            storeCode,
            customerToken
          }
        }
      );
      return result.data;
    } catch (e) {
      // todo: use new version of error handler
      if ([401, 503].includes(e.statusCode)) {
        e.userMessage = true;
        // avoid removing customer token in onError hook
        delete e.code;
        e.noLogging = true;
      }

      throw e;
    }
  }
  /**
   * Check if given password reset token is valid
   * @param {Object} params - request params
   * @returns {{data, meta}|*} true if token is valid
   */
  async validatePasswordToken(params) {
    const { storeCode, id, token } = params;
    const validatePath = `/customers/${id}/password/resetLinkToken/${token}`;

    try {
      const result = await this.get(
        validatePath,
        {},
        {
          context: {
            storeCode
          }
        }
      );
      return result.data;
    } catch (e) {
      // todo: use new version of error handler
      e.userMessage = true;
      e.noLogging = true;

      // todo check why there's no throw here
    }
  }

  /**
   * Generate customer password reset token
   * @param {Object} params - request params
   * @param {Object} params.data - reset password form data
   * @param {String} params.data.email - user email
   * @returns {{data}|*} always true to avoid spying for registered emails
   */
  async requestCustomerPasswordResetToken(params) {
    const {
      data: { email },
      storeCode
    } = params;

    const result = await this.put(
      '/customers/password',
      { email, template: 'email_reset' },
      {
        context: {
          storeCode
        }
      }
    );

    return result.data;
  }

  /**
   * Reset customer password using provided reset token
   * @param {Object} params - request params
   * @param {String} params.storeCode - current store code
   * @param {Object} params.data - create new password form data
   * @param {String} params.data.customerId - customer email
   * @param {String} params.data.resetToken - reset token
   * @param {String} params.data.password - new password to set
   * @returns {{data, meta}|*} true on success
   */
  async resetCustomerPassword(params) {
    const {
      storeCode,
      data: { customerId: email, resetToken, password: newPassword }
    } = params;

    const result = await this.put(
      '/customers/password/reset',
      { email, resetToken, newPassword },
      {
        context: {
          storeCode
        }
      }
    );

    return result.data;
  }
};
