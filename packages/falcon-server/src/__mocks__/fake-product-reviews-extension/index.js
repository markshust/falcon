const { Extension } = require('@deity/falcon-server-env');

module.exports = class FakeProductReviewsExtension extends Extension {
  getGraphQLConfig() {
    // use promise to make sure async stuff works correctly
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          schema: [
            `type Review {
                id: Int!
                content: String!
            }`,
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
