const { mockServer } = require('graphql-tools');
const Blog = require('.');

const mocks = {
  Post: () => ({
    id: 1,
    title: 'Post title',
    content: 'Lorem ipsum',
    excerpt: 'Lorem',
    slug: 'sample-post'
  }),

  PostImage: () => ({
    url: 'image.png',
    description: 'post image'
  })
};

const QUERY_TEST_CASES = [
  {
    name: 'post - should return correct post object',
    query: `
      query Post($path: String!) {
        post(path: $path) {
          id
          title
          content
          slug
          image {
            url
          }
          related {
            id
          }
        }
      }
    `,
    variables: {
      path: '/sample-post'
    },
    expected: {
      data: {
        post: {
          id: 1,
          title: 'Post title',
          content: 'Lorem ipsum',
          slug: 'sample-post',
          image: { url: 'image.png' },
          related: [{ id: 1 }, { id: 1 }]
        }
      }
    }
  },

  {
    name: 'posts - should return all posts',
    query: `
      query {
        posts {
          id
          title
        }
      }
    `,
    expected: {
      data: {
        posts: [
          {
            id: 1,
            title: 'Post title'
          },
          {
            id: 1,
            title: 'Post title'
          }
        ]
      }
    }
  }
];

describe('Falcon Blog Extension', () => {
  describe('Schema', () => {
    let schema;
    let server;
    beforeAll(() => {
      const blog = new Blog();

      // prepare server with mocks for tests
      ({ schema } = blog.getGraphQLConfig());
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
