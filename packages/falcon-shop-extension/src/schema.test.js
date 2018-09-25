const { mockServer } = require('graphql-tools');
const { ApiDataSource } = require('@deity/falcon-server-env');
const Shop = require('.');
const { BaseSchema } = require('@deity/falcon-server');

class CustomApi extends ApiDataSource {
  async getPosts() {
    return [];
  }
}

const mocks = {
  Category: () => ({
    id: 1,
    name: 'category name',
    description: 'lorem ipsum'
  }),

  Product: () => ({
    id: 1,
    sku: '111',
    name: 'product name',
    image: 'product image',
    urlPath: 'product url'
  })
};

const QUERY_TEST_CASES = [
  {
    name: 'category - should return correct category',
    query: `
      query Category($id: Int!) {
        category(id: $id) {
          id
          name
          description
        }
      }
    `,
    variables: {
      id: 1
    },
    expected: { data: { category: { id: 1, name: 'category name', description: 'lorem ipsum' } } }
  },

  {
    name: 'products - should return correct products list',
    query: `
      query Products($categoryId: Int) {
        products(categoryId: $categoryId) {
          items {
            id
            sku
            name
          }
        }
      }
    `,
    expected: {
      data: {
        products: {
          items: [
            {
              id: 1,
              sku: '111',
              name: 'product name'
            },
            {
              id: 1,
              sku: '111',
              name: 'product name'
            }
          ]
        }
      }
    }
  }
];

describe('Falcon Shop Extension', () => {
  describe('Schema', () => {
    let schema;
    let server;
    beforeAll(() => {
      const shop = new Shop();
      shop.api = new CustomApi();

      // prepare server with mocks for tests
      ({ schema } = shop.getGraphQLConfig());
      schema.push(BaseSchema);
      server = mockServer(schema, mocks);
    });

    it('should have valid type definitions', async () => {
      expect(async () => {
        await server.query(`{ __schema { types { name } } }`);
      }).not.toThrow();
    });

    QUERY_TEST_CASES.forEach(conf => {
      const { name, query, variables = {}, context = {}, expected } = conf;
      it(`Query: ${name}`, async () => expect(server.query(query, variables, context)).resolves.toEqual(expected));
    });
  });
});
