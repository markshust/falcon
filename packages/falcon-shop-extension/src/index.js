const Logger = require('@deity/falcon-logger');
const { Extension } = require('@deity/falcon-server-env');
const { resolve } = require('path');

const typeDefs = require('fs').readFileSync(resolve(__dirname, 'schema.graphql'), 'utf8');

/**
 * Extension that implements shop features
 */
module.exports = class Shop extends Extension {
  async initialize() {
    await super.initialize();
    return this.initConfig();
  }

  async initConfig() {
    Logger.debug('Loading shop config');

    const {
      baseCurrencyCode,
      activeStores,
      postCodes,
      minPasswordLength,
      minPasswordCharClass,
      locale
    } = await this.api.getInfo();

    Logger.debug(`Locale set to: ${locale}.`);
    this.defaultLanguage = locale;
    Logger.debug(`Currency set to: ${baseCurrencyCode}.`);
    this.currency = baseCurrencyCode;
    this.stores = activeStores;
    this.optionalPostCode = postCodes;
    this.customerConfiguration = {
      minPasswordLength,
      minPasswordCharClass
    };
  }

  getGraphQLConfig() {
    return {
      schema: [typeDefs],
      dataSources: {
        [this.api.name]: this.api
      },
      resolvers: {
        Query: {
          category: (root, params, { session: { storeCode, currency } }) =>
            this.api.fetchCategory({ storeCode, currency, ...params }),
          products: (root, params, { session: { storeCode, currency } }) =>
            this.api.fetchProducts({ storeCode, currency, ...params }),
          cart: (root, data, { session }) => {
            if (!session.cart || !session.cart.quoteId) {
              return {
                active: false,
                itemsQty: 0,
                items: [],
                totals: []
              };
            }
            return this.api.fetchCart(session);
          },
          product: (root, params, { session: { storeCode, currency } }) =>
            this.api.fetchProductById({ ...params, storeCode, currency }),
          countries: (root, params, { session: { storeCode } }) => this.api.fetchCountries(storeCode),
          customer: (root, params, { session: { storeCode, customerToken } }) =>
            this.api.getCustomerData({ storeCode, customerToken }),
          lastOrder: (root, params, { session: { storeCode, orderId, paypalExpressHash } }) =>
            this.api.getLastOrder({ storeCode, orderId, paypalExpressHash }),
          order: (root, params, { session: { storeCode, customerToken } }) =>
            this.api.getOrderById({ storeCode, customerToken, ...params }),
          orders: (root, params, { session: { storeCode, customerToken } }) =>
            this.api.getOrders({ storeCode, customerToken, ...params }),
          address: (root, params, { session: { storeCode, customerToken } }) =>
            this.api.forwardAddressAction({ storeCode, customerToken, ...params }),
          validatePasswordToken: (root, params, { session: { storeCode } }) =>
            this.api.validatePasswordToken({ storeCode, ...params }),
          cmsPage: (root, params, { session: { storeCode } }) => this.api.fetchPage({ ...params, storeCode }),
          cmsBlock: (root, params, { session: { storeCode } }) => this.api.fetchBlock({ ...params, storeCode })
        },
        Mutation: {
          addToCart: (root, data, { session }) => this.api.addToCart(data.input, session),
          updateCartItem: (root, data, { session }) => this.api.updateCartItem(data.input, session),
          removeCartItem: (root, data, { session }) => this.api.removeFromCart(data.input, session),
          applyCoupon: (root, data, { session }) => this.api.applyCoupon(data.input, session),
          cancelCoupon: (root, data, { session }) => this.api.cancelCoupon(session),
          signUp: (root, data, { session: { storeCode, cart } }) => this.api.signUp(data.input, { storeCode, cart }),
          signIn: (root, data, { session }) => this.api.signIn(data.input, session),
          signOut: (root, data, { session }) => this.api.signOut(session),
          editCustomerData: (root, data, { session }) => this.api.editCustomerData(data.input, session),
          estimateShippingMethods: (root, data, { session }) => this.api.estimateShippingMethods(data.input, session),
          placeOrder: (root, data, { session }) => this.api.placeOrder(data.input, session),
          setShipping: (root, data, { session }) => this.api.setShippingInformation(data.input, session),
          editCustomerAddress: (root, data, { session: { storeCode, customerToken } }) =>
            this.api.forwardAddressAction({
              data: data.input,
              storeCode,
              customerToken,
              method: 'put'
            }),
          addCustomerAddress: (root, data, { session: { storeCode, customerToken } }) =>
            this.api.forwardAddressAction({
              data: data.input,
              storeCode,
              customerToken,
              method: 'post'
            }),
          removeCustomerAddress: (root, params, { session: { storeCode, customerToken } }) =>
            this.api.forwardAddressAction({ storeCode, customerToken, method: 'delete', ...params }),
          requestCustomerPasswordResetToken: (root, data, { session: { storeCode } }) =>
            this.api.requestCustomerPasswordResetToken({ storeCode, data }),
          changeCustomerPassword: (root, data, { session: { storeCode, customerToken } }) =>
            this.api.changeCustomerPassword({ storeCode, data: data.input, customerToken }),
          resetCustomerPassword: (root, data, { session: { storeCode } }) =>
            this.api.resetCustomerPassword({ storeCode, data: data.input })
        }
      }
    };
  }

  /**
   * Get priority factor for the given path (how likely it is to be handled by this middleware)
   * This method is used by {@link ApiServer#getUrlApis}
   * @param {String} path - path to check
   * @returns {Number} - priority factor
   */
  getFetchUrlPriority(path) {
    if (path.endsWith('.html')) {
      return 5;
    }

    return 20;
  }

  async fetchUrl(root, { path }, { session = {} }) {
    const { language, storeCode, currency } = session;
    return this.api.fetchUrl(path, language, storeCode, currency);
  }
};
