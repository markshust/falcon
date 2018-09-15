const { Extension } = require('@deity/falcon-server-env');

module.exports = class FakeShopExtension extends Extension {
  getGraphQLConfig() {
    return {
      schema: `
      type Product {
        id: Int!
        name: String!
      }

      extend type Query {
        products: [Product]
      }`,
      resolvers: {
        Query: {
          products: () => {}
        },
        Product: {
          id: () => {},
          name: () => {}
        }
      }
    };
  }
};
