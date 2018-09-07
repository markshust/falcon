global.__SERVER__ = true; // eslint-disable-line no-underscore-dangle

const { mockServer } = require('graphql-tools');
const Logger = require('@deity/falcon-logger');
const ExtensionsContainer = require('./extensions');

// disable logger for tests
Logger.setLogLevel('error');

const extensions = [
  {
    package: './__mocks__/FakeShopExtension',
    options: {
      apiUrl: 'https://example.com'
    }
  },
  {
    package: './__mocks__/FakeProductReviewsExtension'
  }
];

const mocks = {
  Product: () => ({
    id: 1,
    name: 'test product'
  }),

  Review: () => ({
    id: 2,
    content: 'review content'
  })
};

describe('ExtensionsContainer', () => {
  let container;

  beforeEach(() => {
    container = new ExtensionsContainer({ extensions });
  });

  it('should correctly load extensions passed in configuration', () => {
    expect(container.extensions.length).toEqual(2);
  });

  it('should correctly pass configuration to extensions', () => {
    expect(container.extensions[0].config.apiUrl).toEqual('https://example.com');
  });

  describe('Schema stitching', () => {
    it('should not throw errors during GraphQL config computing', () => {
      expect(async () => {
        await container.createGraphQLConfig();
      }).not.toThrow();
    });

    it('should produce proper schema from schemas returned by extensions', async () => {
      const query = `
        {
          __type(name: "Product") {
            name
            fields {
              name
            }
          }
        }
      `;
      const { schema } = await container.createGraphQLConfig();
      const server = mockServer(schema, mocks);
      const result = await server.query(query);
      expect(result.data.__type.fields.length).toEqual(3); // eslint-disable-line no-underscore-dangle
    });
  });
});
