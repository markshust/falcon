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
   * Set shop configuration
   * @param {ShopConfigInput} params - params to be set
   * @return {boolean} true when change has been successful
   */
  setConfig(params) {
    const { storeCode } = params;
    if (storeCode) {
      this.context.magento2.storeCode = storeCode;
    }
    return true;
  }

  /**
   * Fetch category data
   * @param {object} params - params with id of category
   * @param {number} params.id - id of the requested category
   * @return {Promise<Category>} - converted response with category data
   */
  async category(params) {
    const response = await this.get(
      `/categories/${params.id}`,
      {
        storeCode: this.context.magento2.storeCode
      },
      { context: { useAdminToken: true } }
    );
    return this.convertCategoryData(response);
  }

  /**
   * Process category data from Magento2 response
   * @param {object} response - response from Magento2 backend
   * @return {Category} processed response
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
   * @return {object} converted response
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
   * @return {string} converted path
   * @todo get suffix from Magento2 config
   */
  convertPathToUrl(path) {
    return `${path}.html`;
  }

  /**
   * Convert breadcrumbs for category, product entities
   * @param {object[]} breadcrumbs  - array of breadcrumbs entries from Magento
   * @return {Breadcrumb[]} converted breadcrumbs
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
   * @param {number} [params.categoryId] - id of the category to search in
   * @param {boolean} [params.includeSubcategories] - flag indicates if products from subcategories should be included
   * @param {ShopPageQuery} [params.query] - definitions of aggregations
   * @param {SortOrder[]} [params.sortOrders] - definition of sort orders
   * @param {Filter[]} [params.filters] - filters that should be used for filtering
   * @param {string[]} [skus] - skus of products that search should be narrowed to
   * @return {Promise<Product[]>} - response with list of products
   */
  async products(params) {
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
   * @param {object} params - request params that should be populated with filters
   * @param {string} field - filter field to include
   * @param {string} value - field value
   * @param {string} conditionType - condition type of the filter
   * @return {object} - request params with additional filter
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
   * Fetch list of the products based on passed criteria
   * @param {Object} params - search criteria
   * @return {Promise<Product[]>} - list of product items
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
   * @param {string} filterName - name of the filter
   * @param {object} params - params with filters
   * @return {boolean} if filter is set
   */
  isFilterSet(filterName, params = {}) {
    const { filters = [] } = params || {};

    return filters.some(({ filters: filterItems = [] }) =>
      filterItems.some(filterItem => filterItem.field === filterName)
    );
  }

  /**
   * Generic method for endpoints handling category and product listing
   * @param {string} path - path to magento api endpoint
   * @param {object} params - request params
   * @param {object[]} [params.filters] - filters for the collection
   * @param {boolean} [params.includeSubcategories] - use subcategories in the search flag
   * @param {object} [params.query] - request query params
   * @param {number} [params.query.page] - pagination page
   * @param {number} [params.query.perPage] - number of items per page
   * @param {object[]} [params.sortOrders] - list of sorting parameters
   * @param {string[]} [params.withAttributeFilters] - list of attributes for layout navigation
   * @return {Promise<Product[] | Category[]>} - response from endpoint
   */
  async fetchList(path, params) {
    const {
      query: { page = 1, perPage } = {},
      filters: filterGroups = [],
      includeSubcategories = false,
      withAttributeFilters = [],
      sortOrders = {}
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
      {
        context: { useAdminToken: true }
      }
    );

    return this.convertList(response, this.context.magento2.currency);
  }

  /**
   * Process data from listing endpoint
   * @param {object} response - response from Magento2 backend
   * @param {string} currency - selected currency
   * @return {object} - processed response
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
   * @param {object} response - response from Magento2 backend
   * @param {string} currency - selected currency
   * @return {Product} - processed response
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
   * @param {object} params - request params
   * @param {string} [params.path] - request path to be checked against api urls
   * @param {boolean} [params.loadEntityData] - flag to mark whether endpoint should return entity data as well
   * @return {Promise} - request promise
   */
  async fetchUrl(params) {
    const { path, loadEntityData = false } = params;

    return this.get(
      '/url/',
      {
        request_path: path,
        load_entity_data: loadEntityData
      },
      {
        context: {
          didReceiveResult: result => this.reduceUrl(result, this.context.magento2.currency)
        }
      }
    );
  }

  /**
   * Reduce url endpoint data.
   * Find entity reducer and use it.
   *
   * @param {object} data - parsed response Api Response
   * @param {string} [currency] currency code
   * @return {CmsPage | Product | Category} reduced data
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
   * @param {object} response - full api response
   * @return {CmsPage} - reduced response
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
   * @param {object} response - api response
   * @param {string} [currency] - currency code
   * @return {Product} - reduced data
   */
  reduceProduct(response, currency = null) {
    this.convertProductData(response, currency);

    return response;
  }

  /**
   * Reduce category data
   * @param {object} response - api response
   * @return {Category} reduced data
   */
  reduceCategory(response) {
    this.convertCategoryData(response);

    return response;
  }

  /**
   * Search for product with id
   * @param {object} params - request params
   * @param {number} params.id - product id called by magento entity_id
   * @return {Promise<Product>} product data
   */
  async product(params) {
    const urlPath = `catalog/product/view/id/${params.id}`;

    return this.fetchUrl({ path: urlPath, loadEntityData: true });
  }

  /**
   * Add product to cart
   *
   * @param {object} input - product data
   * @param {string} input.sku - added product sku
   * @param {number} input.qty - added product qty
   * @return {Promise<CartItemPayload>} - cart item data
   */
  async addToCart(input) {
    const cartData = await this.ensureCart();
    const cartPath = this.getCartPath();

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
      const { data: cartItem } = await this.post(`${cartPath}/items`, product);

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
   * Creates cart if it doesn't yet exist.
   * @return {object} - new cart data
   */
  async ensureCart() {
    const { cart, customerToken: { token } = {} } = this.context.magento2;

    if (cart && cart.quoteId) {
      return cart;
    }

    const cartPath = token ? '/carts/mine' : '/guest-carts';
    const response = await this.post(cartPath);

    this.context.magento2.cart = { quoteId: response.data };

    return this.context.magento2.cart;
  }

  /**
   * Generate prefix for path to cart based on current user session state
   * @return {string} - prefix for cart endpoints
   */
  getCartPath() {
    const { cart, customerToken = {} } = this.context.magento2;

    if (!customerToken.token && !cart) {
      throw new Error('No cart in session for not registered user.');
    }

    return customerToken.token ? '/carts/mine' : `/guest-carts/${cart.quoteId}`;
  }

  /**
   * Make sure price fields are float
   * @param {object} data - object to process
   * @param {string[]} fieldsToProcess - array with field names
   * @return {object} updated object
   */
  processPrice(data = {}, fieldsToProcess = []) {
    fieldsToProcess.forEach(field => {
      data[field] = parseFloat(data[field]);
    });

    return data;
  }

  /**
   * Get cart data
   * @return {Promise<Cart>} - customer cart data
   */
  async cart() {
    const { magento2 } = this.context;
    const quoteId = magento2.cart && magento2.cart.quoteId;

    if (!magento2.cart || !magento2.cart.quoteId) {
      return {
        active: false,
        itemsQty: 0,
        items: [],
        totals: []
      };
    }

    if (!quoteId) {
      throw Error('Trying to fetch cart data without quoteId param');
    }

    // todo avoid calling both endpoints if not necessary
    const cartPath = this.getCartPath();
    const [{ data: quote }, { data: totals }] = await Promise.all([
      this.get(
        cartPath,
        {},
        {
          context: { didReceiveResult: result => this.convertKeys(result) }
        }
      ),
      this.get(
        `${cartPath}/totals`,
        {},
        {
          context: { didReceiveResult: result => this.convertKeys(result) }
        }
      )
    ]);

    return this.convertCartData(quote, totals);
  }

  /**
   * Process and merge cart and totals response
   * @param {object} quoteData - data from cart endpoint
   * @param {object} totalsData - data from cart totals endpoint
   * @return {Cart} object with merged data
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
   * @return {CountriesList} parsed country list
   */
  async countries() {
    const response = await this.get('/directory/countries', {}, { context: { useAdminToken: false } });

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
   * @param {SignIn} data - form data
   * @param {string} data.email - user email
   * @param {string} data.password - user password
   * @return {Promise<boolean>} true if login was successful
   */
  async signIn(data) {
    const { email, password } = data;
    const { cart: { quoteId = null } = {} } = this.context.magento2;

    try {
      const response = await this.post('/integration/customer/token', {
        username: email,
        password,
        guest_quote_id: quoteId
      });

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
      this.context.magento2.customerToken = customerTokenObject;

      // Remove guest cart. Magento merges guest cart with cart of authorized user so we'll have to refresh it
      delete this.context.magento2.cart;
      // make sure that cart is correctly loaded for signed in user
      await this.ensureCart();

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
   * @todo revoke customer token using Magento api
   * @return {Promise<boolean>} true
   */
  async signOut() {
    /* Remove logged in customer data */
    delete this.context.magento2.customerToken;
    delete this.context.magento2.cart;

    return true;
  }

  /**
   * Create customer account
   * @param {SignUp} data - registration form data
   * @param {string} data.email - customer email
   * @param {string} data.firstname - customer first name
   * @param {String} data.lastname - customer last name
   * @param {String} data.password - customer password
   * @param {string|number} params.cart.quoteId - cart id
   * @return {Promise<Customer>} - new customer data
   */
  async signUp(data) {
    const { email, firstname, lastname, password } = data;
    const { cart: { quoteId = null } = {} } = this.context.magento2;
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
      const result = await this.post('/customers', customerData);
      result.data = this.convertKeys(result.data);
      return result;
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
   * @return {Promise<Customer>} - converted customer data
   */
  async customer() {
    const { customerToken = {} } = this.context.magento2;

    if (!customerToken.token) {
      throw new Error('Customer token is required.');
    }

    const response = await this.get('/customers/me');

    const convertedData = this.convertKeys(response.data);
    convertedData.addresses = convertedData.addresses.map(addr => this.convertAddressData(addr));

    const { extensionAttributes = {} } = convertedData;
    if (!isEmpty(extensionAttributes)) {
      delete convertedData.extensionAttributes;
    }

    return { ...convertedData, ...extensionAttributes };
  }

  /**
   * Converts address response from magento to Address type
   * @param {object} response - api response
   * @return {Address} parsed address
   */
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
   * @param {object} params - request params
   * @param {object} params.query - request query params
   * @param {number} params.query.page - pagination page
   * @param {number} params.query.perPage - number of items per page
   * @return {Orders} parsed orders with pagination info
   */
  async orders(params) {
    const {
      query: { page, perPage }
    } = params;
    const { customerToken = {} } = this.context.magento2;

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

    const response = await this.get('/orders/mine', { searchCriteria });

    return this.convertKeys(response.data);
  }

  /**
   * Fetch info about customer order based on order id
   * @param {object} params - request params
   * @param {number} params.id - order id
   * @return {Promise<Order>} - order info
   */
  async order(params) {
    const { id } = params;
    const { customerToken = {} } = this.context.magento2;

    if (!id) {
      Logger.error('Trying to fetch customer order info without order id');
      throw new Error('Failed to load an order.');
    }

    if (!customerToken.token) {
      Logger.error('Trying to fetch customer order info without customer token');
      throw new Error('Failed to load an order.');
    }

    const result = this.get(`/orders/${id}/order-info`);

    return this.convertOrder(result);
  }

  /**
   * Process customer order data
   * @param {object} response - response from Magento2 backend
   * @return {Order} processed order
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
   * @param {object[]} response - products bought
   * @return {OrderItem[]} converted items
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
   * @param {object} response - totals response from Magento2 backend
   * @return {object} processed response
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
   * @param {UpdateCartItemInput} input - cart item data
   * @param {string} [input.sku] - item sku
   * @param {number} [input.qty] - item qty
   * @param {object} session - request params
   * @param {string} [params.customerToken] - customer token
   * @param {string} [params.storeCode] - selected store code
   * @param {object} [params.cart] - customer cart
   * @param {String|Number} [params.cart.quoteId] - cart id
   * @return {Promise<CartItemPayload>} - updated item data
   */
  async updateCartItem(input) {
    const { cart } = this.context.magento2;
    const { quoteId } = cart;
    const { itemId, sku, qty } = input;

    const cartPath = this.getCartPath();

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

    const { data: cartItem } = await this.put(`${cartPath}/items/${itemId}`, data);

    this.convertKeys(cartItem);
    this.processPrice(cartItem, ['price']);

    return cartItem;
  }

  /**
   * Remove item from cart
   * @param {RemoveCartItemInput} input - cart item data
   * @param {string} [input.itemId] - item id
   * @param {string|number} [params.cart.quoteId] - cart id
   * @return {Promise<boolean>} true on success
   */
  async removeCartItem(input) {
    const { cart } = this.context.magento2;
    const { itemId } = input;
    const cartPath = this.getCartPath();

    if (cart && cart.quoteId) {
      const result = await this.delete(`${cartPath}/items/${itemId}`);
      return result.data;
    }

    Logger.warn('Trying to remove cart item without quoteId');

    return false;
  }

  /**
   * Updates customer profile data
   * @param {CustomerInput} data - data to be saved
   * @return {Promise<Customer>} updated customer data
   */
  async editCustomerData(data) {
    const response = await this.put('/customers/me', { customer: { ...data } });

    return this.convertKeys(response.data);
  }

  /**
   * Request customer address
   * @param {object} params - request params
   * @param {number} params.id - address id
   * @return {Promise<Address>} requested address data
   */
  async address(params) {
    return this.forwardAddressAction(params);
  }

  /**
   * Add new customer address
   * @param {AddressInput} data - address data
   * @return {Promise<Address>} added address data
   */
  async addCustomerAddress(data) {
    return this.forwardAddressAction({ data, method: 'post' });
  }

  /**
   * Change customer address data
   * @param {AddressInput} data - data to change
   * @return {Promise<Address>} updated address data
   */
  async editCustomerAddress(data) {
    return this.forwardAddressAction({ data, method: 'put' });
  }

  /**
   * Remove customer address data
   * @param {EntityIdInput} data - address to remove
   * @return {boolean} true when removed successfully
   */
  async removeCustomerAddress(data) {
    return this.forwardAddressAction({ id: data.id, method: 'delete' });
  }

  /**
   * Request address management action
   * @param {object} params - request params
   * @param {string} params.customerToken - customer token
   * @param {number} params.id - address id
   * @param {string} params.storeCode - selected store code
   * @param {string} params.path - REST API path where default path is 'customers/me/address'
   * @param {string} params.method - request method, where default method is 'get'
   * @return {Promise<Address|Address[]|boolean>} - address data, list of addresses or true after successful delete
   */
  async forwardAddressAction(params = {}) {
    const { id, path = '/customers/me/address', method = 'get', data = null } = params;
    const { customerToken = {} } = this.context.magento2;

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

    const response = await this[method](addressPath, method === 'get' || method === 'delete' ? null : addressData);

    if (method !== 'delete') {
      return this.convertAddressData(response.data);
    }

    return response.data;
  }

  /**
   * Check if given password reset token is valid
   * @param {object} params - request params
   * @param {number} params.id - customer id
   * @param {string} params.token - reset password token
   * @return {Promise<boolean>} true if token is valid
   */
  async validatePasswordToken(params) {
    const { id, token } = params;
    const validatePath = `/customers/${id}/password/resetLinkToken/${token}`;

    try {
      const result = await this.get(validatePath);
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
   * @param {EmailInput} params - request params
   * @param {string} params.email - user email
   * @return {Promise<boolean>} always true to avoid spying for registered emails
   */
  async requestCustomerPasswordResetToken(params) {
    const { email } = params;
    await this.put('/customers/password', { email, template: 'email_reset' });
    return true;
  }

  /**
   * Reset customer password using provided reset token
   * @param {CustomerPasswordReset} params - request params
   * @param {string} params.customerId - customer email
   * @param {string} params.resetToken - reset token
   * @param {string} params.password - new password to set
   * @return {Promise<boolean>} true on success
   */
  async resetCustomerPassword(params) {
    const { customerId: email, resetToken, password: newPassword } = params;
    const result = await this.put('/customers/password/reset', { email, resetToken, newPassword });
    return result.data;
  }

  /**
   * Change customer password
   * @param {CustomerPasswordReset} params - request params
   * @param {string} params.password - new password
   * @param {string} params.currentPassword - current password
   * @return {Promise<boolean>} true on success
   */
  async changeCustomerPassword(params) {
    const { password: newPassword, currentPassword } = params;
    const { customerToken = {} } = this.context.magento2;

    if (!customerToken.token) {
      Logger.error('Trying to edit customer data without customer token');
      throw new Error('You do not have an access to edit account data');
    }

    try {
      const result = await this.put('/customers/me/password', { currentPassword, newPassword });
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
   * Apply coupon to cart
   * @param {CouponInput} input - request data
   * @param {string} [input.couponCode] - coupon code
   * @return {Promise<boolean>} true on success
   */
  async applyCoupon(input) {
    const { cart } = this.context.magento2,
      route = this.getCartPath();

    if (!cart || !cart.quoteId) {
      throw new Error('Trying to apply coupon without quoteId in session');
    }

    try {
      return await this.put(`${route}/coupons/${input.couponCode}`);
    } catch (e) {
      if (e.statusCode === 404) {
        e.userMessage = true;
        e.noLogging = true;
      }

      throw e;
    }
  }

  /**
   * Remove coupon from the cart
   * @return {Promise<boolean>} true on success
   */
  async cancelCoupon() {
    const { cart } = this.context.magento2;
    const route = this.getCartPath();

    if (cart && cart.quoteId) {
      return this.delete(`${route}/coupons`);
    }

    throw new Error('Trying to remove coupon without quoteId in session');
  }

  async estimateShippingMethods(params) {
    const response = await this.performCartAction(
      '/estimate-shipping-methods',
      'post',
      // todo: check why params cannot be passed here directly. In this case params.constructor === undefined
      // and because of that RESTDataSource.fetch() cannot properly serialize to before sending
      // Using Object.assign() fixes the problem with constructor property so fetch() works correctly then
      Object.assign({}, params)
    );

    response.data.forEach(method => {
      method.currency = this.context.magento2.currency;
    });

    return this.convertKeys(response.data);
  }

  /**
   * Make a call to cart related endpoint
   * @param {string} path - path to magento api endpoint
   * @param {string} method - request method
   * @param {object} data - request data
   * @return {Promise<object>} response data
   */
  async performCartAction(path, method, data) {
    const { cart } = this.context.magento2;

    if (!cart.quoteId) {
      const errorMessage = `Quote id is empty, cannot perform api call for ${path}`;

      Logger.warn(errorMessage);
      throw new Error(errorMessage);
    }

    const cartPath = this.getCartPath();

    const response = await this[method](`${cartPath}${path}`, method === 'get' ? null : data);

    const cartData = this.convertKeys(response.data);

    if (cartData instanceof Object) {
      return response;
    }

    response.data = {
      data: cartData
    };

    return response;
  }

  /**
   * Sets shipping method for the order
   * @param {ShippingInput} data - shipping configuration
   * @return {Promise<ShippingInformation>} shipping configuration info
   */
  async setShipping(data) {
    const magentoData = {
      addressInformation: data
    };

    const response = await this.performCartAction('/shipping-information', 'post', magentoData);

    return this.convertKeys(response.data);
  }

  /**
   * Place order
   * @param {PlaceOrderInput} data - form data
   * @return {Promise<PlaceOrderResult>} order data
   */
  async placeOrder(data) {
    let response;
    try {
      response = await this.performCartAction('/deity-order', 'put', Object.assign({}, data), this.context.magneto2);
    } catch (e) {
      // todo: use new version of error handler
      if (e.statusCode === 400) {
        e.userMessage = true;
        e.noLogging = true;
      }
      throw e;
    }

    const orderData = response.data;
    if (orderData.extensionAttributes && orderData.extensionAttributes.adyen) {
      orderData.adyen = orderData.extensionAttributes.adyen;
      delete orderData.extensionAttributes.adyen;
      response.data = orderData;
    }

    this.context.magento2.orderId = orderData.orderId;

    if (!this.context.magento2.orderId) {
      throw new Error('no order id from magento.');
    }

    this.context.magento2.orderQuoteId = this.context.magento2.cart.quoteId;

    return response.data;
  }

  /**
   * Load last customer's order
   * @return {Promise<Order>} last order data
   */
  async lastOrder() {
    const { orderId, paypalExpressHash } = this.context.magento2;
    let lastOrderId = orderId;

    if (!orderId && paypalExpressHash) {
      // fetch last order id based on hash generated when asking for paypal token
      const orderIdRequest = await this.get(`/orders/get-order-from-paypal-hash/${paypalExpressHash}`);
      lastOrderId = orderIdRequest.data;
    }

    if (!lastOrderId) {
      Logger.warn('Trying to fetch order info without order id');

      return {};
    }

    const response = await this.get(`/orders/${lastOrderId}`);
    response.data = this.convertKeys(response.data);
    response.data.paymentMethodName = response.data.payment.method;

    return response.data;
  }
};
