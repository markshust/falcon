const { mockServer } = require('graphql-tools');
const ExtensionContainer = require('./ExtensionContainer');

const extensions = [
  {
    package: 'fake-shop-extension',
    config: {
      apiUrl: 'https://example.com'
    }
  },
  {
    package: 'fake-product-reviews-extension'
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

describe('ExtensionContainer', () => {
  let container;

  beforeEach(() => {
    container = new ExtensionContainer(extensions, {});
  });

  it('should correctly load extensions passed in configuration', () => {
    expect(container.extensions.size).toEqual(2);
  });

  it('should correctly pass configuration to extensions', () => {
    expect(container.extensions.get('fake-shop-extension').config.apiUrl).toEqual('https://example.com');
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
