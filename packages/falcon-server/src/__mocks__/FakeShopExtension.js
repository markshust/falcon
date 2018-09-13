const { makeExecutableSchema } = require('graphql-tools');

module.exports = class FakeShopExtension {
  constructor(config) {
    this.config = config;
  }

  getGraphQLConfig() {
    return {
      schema: makeExecutableSchema({
        typeDefs: `
          type Product {
            id: Int!
            name: String!
          }

          type Query {
            products: [Product]
          }

          schema {
            query: Query
          }
        `
      }),
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
