const { makeExecutableSchema } = require('graphql-tools');

module.exports = class FakeProductReviewsExtension {
  getGraphQLConfig() {
    // use promise to make sure async stuff works correctly
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          schema: [
            makeExecutableSchema({
              typeDefs: `
                type Review {
                  id: Int!
                  content: String!
                }
              `
            }),
            `extend type Product {
              reviews: [Review]
            }`
          ],
          resolvers: {
            Review: {
              id: () => {},
              content: () => {}
            },
            Product: {
              reviews: () => {}
            }
          }
        });
      }, 10);
    });
  }
};
