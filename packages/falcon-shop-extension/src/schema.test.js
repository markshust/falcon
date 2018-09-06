const { addMockFunctionsToSchema } = require('graphql-tools');
const { graphql } = require('graphql');
const Shop = require('.');

/**
 * Helper based on mockServer from 'graphql-tools' but provides possibility to pass also context
 * during query execution
 * @param {GraphQLSchema} schema - executable schema to be tested
 * @param {Object} mocks - map with mocks
 * @param {boolean} preserveResolvers - flag passed directly to addMockFunctionsToSchema
 * @returns {Object} mocked server with query() method
 */
function mockServer(schema, mocks, preserveResolvers = false) {
  if (mocks) {
    addMockFunctionsToSchema({ schema, mocks, preserveResolvers });
  }
  return { query: (query, vars, ctx) => graphql(schema, query, {}, { ctx }, vars) };
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

      // prepare server with mocks for tests
      ({ schema } = shop.getGraphQLConfig());
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
