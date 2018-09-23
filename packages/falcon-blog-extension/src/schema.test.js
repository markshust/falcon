const { mockServer } = require('graphql-tools');
const { BaseSchema } = require('@deity/falcon-server');
const { ApiDataSource } = require('@deity/falcon-server-env');
const Blog = require('.');

class CustomApi extends ApiDataSource {
  async getBlogPosts() {
    return [];
  }
}

const mocks = {
  BlogPost: () => ({
    id: 1,
    title: 'Post title',
    content: 'Lorem ipsum',
    excerpt: 'Lorem',
    slug: 'sample-post'
  }),

  BlogPostImage: () => ({
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
          items {
            id
            title
          }
        }
      }
    `,
    expected: {
      data: {
        posts: {
          items: [
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
  }
];

describe('Falcon Blog Extension', () => {
  describe('Schema', () => {
    let schema;
    let server;
    beforeAll(async () => {
      const blog = new Blog();
      blog.api = new CustomApi();

      // prepare server with mocks for tests
      ({ schema } = await blog.getGraphQLConfig());
      schema.push(BaseSchema);
      server = mockServer(schema, mocks);
    });

    it('Should have valid type definitions', async () => {
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
