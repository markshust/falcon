const { makeExecutableSchema } = require('graphql-tools');
const requireGraphQLFile = require('require-graphql-file');

const typeDefs = requireGraphQLFile('./schema');

module.exports = class Shop {
  constructor(config) {
    this.config = config;
  }

  getApi(dataSources) {
    return dataSources[this.config.api];
  }

  getGraphQLConfig() {
    return {
      schema: makeExecutableSchema({ typeDefs }),
      resolvers: {
        Query: {
          category: (root, params, { dataSources, session: { storeCode, currency } }) =>
            this.getApi(dataSources).fetchCategory({ storeCode, currency, ...params }),
          products: (root, params, { dataSources, session: { storeCode, currency } }) =>
            this.getApi(dataSources).fetchProducts({ storeCode, currency, ...params }),
          cart: (root, data, { dataSources, session }) => {
            if (!session.cart || !session.cart.quoteId) {
              return {
                active: false,
                itemsQty: 0,
                items: [],
                totals: []
              };
            }
            return this.getApi(dataSources).fetchCart(session);
          },
          product: (root, params, { dataSources, session: { storeCode, currency } }) =>
            this.getApi(dataSources).fetchProductById({ ...params, storeCode, currency }),
          countries: (root, params, { dataSources, session: { storeCode } }) =>
            this.getApi(dataSources).fetchCountries(storeCode),
          customer: (root, params, { dataSources, session: { storeCode, customerToken } }) =>
            this.getApi(dataSources).getCustomerData({ storeCode, customerToken }),
          lastOrder: (root, params, { dataSources, session: { storeCode, orderId, paypalExpressHash } }) =>
            this.getApi(dataSources).getLastOrder({ storeCode, orderId, paypalExpressHash }),
          order: (root, params, { dataSources, session: { storeCode, customerToken } }) =>
            this.getApi(dataSources).getOrderById({ storeCode, customerToken, ...params }),
          orders: (root, params, { dataSources, session: { storeCode, customerToken } }) =>
            this.getApi(dataSources).getOrders({ storeCode, customerToken, ...params }),
          address: (root, params, { dataSources, session: { storeCode, customerToken } }) =>
            this.getApi(dataSources).forwardAddressAction({ storeCode, customerToken, ...params }),
          validatePasswordToken: (root, params, { dataSources, session: { storeCode } }) =>
            this.getApi(dataSources).validatePasswordToken({ storeCode, ...params }),
          cmsPage: (root, params, { dataSources, session: { storeCode } }) =>
            this.getApi(dataSources).fetchPage({ ...params, storeCode }),
          cmsBlock: (root, params, { dataSources, session: { storeCode } }) =>
            this.getApi(dataSources).fetchBlock({ ...params, storeCode })
        },
        Mutation: {
          addToCart: (root, data, { dataSources, session }) => this.getApi(dataSources).addToCart(data.input, session),
          updateCartItem: (root, data, { dataSources, session }) =>
            this.getApi(dataSources).updateCartItem(data.input, session),
          removeCartItem: (root, data, { dataSources, session }) =>
            this.getApi(dataSources).removeFromCart(data.input, session),
          applyCoupon: (root, data, { dataSources, session }) =>
            this.getApi(dataSources).applyCoupon(data.input, session),
          cancelCoupon: (root, data, { dataSources, session }) => this.getApi(dataSources).cancelCoupon(session),
          signUp: (root, data, { dataSources, session: { storeCode, cart } }) =>
            this.getApi(dataSources).signUp(data.input, { storeCode, cart }),
          signIn: (root, data, { dataSources, session }) => this.getApi(dataSources).signIn(data.input, session),
          signOut: (root, data, { dataSources, session }) => this.getApi(dataSources).signOut(session),
          editCustomerData: (root, data, { dataSources, session }) =>
            this.getApi(dataSources).editCustomerData(data.input, session),
          estimateShippingMethods: (root, data, { dataSources, session }) =>
            this.getApi(dataSources).estimateShippingMethods(data.input, session),
          placeOrder: (root, data, { dataSources, session }) =>
            this.getApi(dataSources).placeOrder(data.input, session),
          setShipping: (root, data, { dataSources, session }) =>
            this.getApi(dataSources).setShippingInformation(data.input, session),
          editCustomerAddress: (root, data, { dataSources, session: { storeCode, customerToken } }) =>
            this.getApi(dataSources).forwardAddressAction({
              data: data.input,
              storeCode,
              customerToken,
              method: 'put'
            }),
          addCustomerAddress: (root, data, { dataSources, session: { storeCode, customerToken } }) =>
            this.getApi(dataSources).forwardAddressAction({
              data: data.input,
              storeCode,
              customerToken,
              method: 'post'
            }),
          removeCustomerAddress: (root, params, { dataSources, session: { storeCode, customerToken } }) =>
            this.getApi(dataSources).forwardAddressAction({ storeCode, customerToken, method: 'delete', ...params }),
          requestCustomerPasswordResetToken: (root, data, { dataSources, session: { storeCode } }) =>
            this.getApi(dataSources).requestCustomerPasswordResetToken({ storeCode, data }),
          changeCustomerPassword: (root, data, { dataSources, session: { storeCode, customerToken } }) =>
            this.getApi(dataSources).changeCustomerPassword({ storeCode, data: data.input, customerToken }),
          resetCustomerPassword: (root, data, { dataSources, session: { storeCode } }) =>
            this.getApi(dataSources).resetCustomerPassword({ storeCode, data: data.input })
        }
      }
    };
  }
};
