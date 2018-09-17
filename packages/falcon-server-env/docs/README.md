# Falcon Server Env

## ApiDataSource

`src/models/ApiDataSource` is a base class for REST API data sources that is
being used by Falcon Server application.

## Extension

`src/models/Extension` is a base class for any extension that is being used
by Falcon Server Application. It adds a few helpful methods to provide
a seamless integration with Falcon Server applications.

## Using ApiDataSource together with Extension

Sample config:

```json
{
  "apis": [
    {
      "name": "api-wordpress",
      "package": "@deity/falcon-wordpress-api",
      "config": {
        "host": "wp.host.com",
        "protocol": "https",
        "apiPrefix": "/blog-api",
        "apiSuffix": "/wp/v2"
      }
    }
  ],
  "extensions": [
    {
      "package": "@deity/falcon-blog-extension",
      "config": {
        "api": "api-wordpress"
      }
    }
  ]
}
```

Sample ApiDataSource class:

```javascript
const { ApiDataSource } = require('@deity/falcon-server-env');

class WordpressApi extends ApiDataSource {
  async getPost(id) {
    // Calling 'https://wp.host.com/blog-api/wp/v2/posts/<id>' endpoint
    return this.get(`/post/${id}`);
  }
}
```

Sample Extension class:

```javascript
const { Extension } = require('@deity/falcon-server-env');

class BlogExtension extends Extension {
  async getGraphQLConfig() {
    return {
      schemas: [
        `type Post {
          name: String
        }`,
        `extend Query {
          getPost(id: String!): Post
        }`
      ],
      dataSources: {
        [this.api.name]: this.api
      }
      resolvers: {
        Query: {
          getPost: (root, { id }, { dataSources }) => {
            /* @type {WordpressApi} */
            const dataSource = dataSources[this.api.name];

            return dataSource.getPost(id);
          }
        }
      }
    };
  }
}
```

ApiContainer and ExtensionContainer will be the rest of the job:

- Creating an instances of both classes
- Assigning specified `extension.config.api` Instance to Extension
- Generating, stitching and merging GraphQL Schema for FalconServer