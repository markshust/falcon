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

    const { baseCurrencyCode, locale } = await this.api.getInfo();

    // todo: verify if this is needed because all the operations that use those are performed inside API class
    // which keeps these values updated locally
    Logger.debug(`Locale set to: ${locale}.`);
    this.defaultLanguage = locale;
    Logger.debug(`Currency set to: ${baseCurrencyCode}.`);
    this.currency = baseCurrencyCode;
  }

  getGraphQLConfig() {
    return {
      schema: [typeDefs],
      dataSources: {
        [this.api.name]: this.api
      },
      context: ({ ctx }) => this.api.createContextData(ctx),
      resolvers: {
        Query: {
          category: (root, params) => this.api.category(params),
          products: (root, params) => this.api.products(params),
          cart: (root, params) => this.api.cart(params),
          product: (root, params) => this.api.product(params),
          countries: (root, params) => this.api.countries(params),
          customer: (root, params) => this.api.customer(params),
          orders: (root, params) => this.api.orders(params),
          order: (root, params) => this.api.order(params),
          address: (root, params) => this.api.address(params),
          validatePasswordToken: (root, params) => this.api.validatePasswordToken(params),
          lastOrder: (root, params) => this.api.lastOrder(params),

          // todo: these two are not yet implemented in the api class
          cmsPage: (root, params) => this.api.fetchPage(params),
          cmsBlock: (root, params) => this.api.fetchBlock(params)
        },
        Mutation: {
          addToCart: (root, data) => this.api.addToCart(data.input),
          updateCartItem: (root, data) => this.api.updateCartItem(data.input),
          removeCartItem: (root, data) => this.api.removeCartItem(data.input),
          signUp: (root, data) => this.api.signUp(data.input),
          signIn: (root, data) => this.api.signIn(data.input),
          // todo: unify signature - pass data.input even if it's empty
          signOut: (root, data) => this.api.signOut(data),
          editCustomerData: (root, data) => this.api.editCustomerData(data.input),
          addCustomerAddress: (root, data) => this.api.addCustomerAddress(data.input),
          editCustomerAddress: (root, data) => this.api.editCustomerAddress(data.input),
          removeCustomerAddress: (root, data) => this.api.removeCustomerAddress(data.input),
          requestCustomerPasswordResetToken: (root, data) => this.api.requestCustomerPasswordResetToken(data.input),
          resetCustomerPassword: (root, data) => this.api.resetCustomerPassword(data.input),
          changeCustomerPassword: (root, data) => this.api.changeCustomerPassword(data.input),
          applyCoupon: (root, data, { session }) => this.api.applyCoupon(data.input, session),
          // todo: unify signature - pass data.input and session even if it's empty
          cancelCoupon: (root, data) => this.api.cancelCoupon(data),
          estimateShippingMethods: (root, data) => this.api.estimateShippingMethods(data.input),
          setShipping: (root, data) => this.api.setShipping(data.input),
          placeOrder: (root, data) => this.api.placeOrder(data.input),
          setConfig: (root, data) => this.api.setConfig(data.input)
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
    return this.api.fetchUrl({ path, language, storeCode, currency });
  }
};
