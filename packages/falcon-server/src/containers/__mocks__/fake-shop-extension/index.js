const { makeExecutableSchema } = require('graphql-tools');
const { Extension } = require('@deity/falcon-server-env');

module.exports = class FakeShopExtension extends Extension {
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
