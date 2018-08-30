# Falcon Server
Falcon Server is the entrypoint for backend features of Falcon stack. It acts as API server for Falcon Client - provides data and features required by Falcon Client. It can also act as standalone API server for other services.

Falcon Server is implemented with [Koa](https://koajs.com/) and [Apollo Server](https://www.apollographql.com/docs/apollo-server/).

Falcon Server is just a "glue" that realises all the functionalities via [extensions](#extensions-system)

## Installation
With npm:

```bash
$ npm install @deity/falcon-server
```
or with yarn:
```bash
$ yarn add @deity/falcon-server
```

## Usage
```js
const FalconServer = require('@deity/falcon-server');
const config = {
  port: 4000
};
const server = new FalconServer(config);
server.start();
```

## Configuration
`config`:<`Object`>
 * `port`: <`Number`> - port number that server should be running on (default is set to 4000)
 * `apis`: <`Array`> - array of APIs configuration. See [APIs configuration](#apis-configuration).
 * `extensions`: <`Array`> - array of extensions configuration. See [Extensions configuration](#extensions-configuration)
 * `session`: <`Object`> - session configuration, [see the details](#session-configuration)

### APIs configuration
`apis` array provides list of APIs that should be used along with options that should be passed to those APIs. Additionally, if API should be available for other extensions its configuration should have `"name"` property that later can be used to get instance of particular extension.

```js
const FalconServer = require('@deity/falcon-server');
const config = {
  "apis": [
    {
      "package": "@deity/falcon-wordpress-api",
      "name": "api-wordpress",
      "options": {
        "host": "mywordpress.com",
        "protocol": "https",
      }
    }
  ]
};
const server = new FalconServer(config);
server.start()
```

### Extensions configuration 
`config` object can contain `extensions` array that provides list of extensions that should be used along with options that should be passed to those extensions. 
Extensions should be added by specifying package name of the extension, and `options` object that is passed to extension constructor:

```js
const FalconServer = require('@deity/falcon-server');
const config = {
  "extensions": [
    { 
      "package": "@deity/falcon-tweets-extension",
      "options": {
        "apiKey": "Your Twitter API key"
      }
    },
    {
      "package": "@deity/falcon-dynamic-route-extension"
    }
  ]
};
const server = new FalconServer(config);
server.start()
```

If extension requires an API to work correctly the API can be either implemented inside the extension, but it can also be implemented as separate package. Then, such API can be added via [`apis`](#apis-configuration) and used by extension. 

This is especially handy when extension realised some piece of functionality that can use data from various 3rd party services - e.g. blog extension can use wodpress for content fetching, but also any other service that can deliver data in the format accepted by blog extension.

```js
const FalconServer = require('@deity/falcon-server');
const config = {
  "apis": [
    {
      "package": "@deity/falcon-wordpress-api",
      "name": "api-wordpress", // set name for that extension
      "options": {
        // options for this api instance
      }
    }
  ],
  "extensions": [
    { 
      "package": "@deity/falcon-blog-extension",
      "options": {
        "api": "api-wordpress" // use API named "api-wordpress"
      }
    }
  ]
};
const server = new FalconServer(config);
server.start()
```

### Session configuration
Falcon Server uses [koa-session](https://www.npmjs.com/package/koa-session) for session implementation, so all the options passed in `session.options` will be passed directly to `koa-session`. Additionally you can provide `session.keys` array with kesy used by `koa` instance:

```js
const FalconServer = require('@deity/falcon-server');
const config = {
  "session": {
    "keys": ["some secret key"], // this value will be set as "keys" property of koa instance
    "options": { // all options allowed by koa-session
      "maxAge": 86400000
    }
  }
};
const server = new FalconServer(config);
server.start()
```

## Extensions system
The essence of Falcon Server is realisation of the access to the external services via GraphQL. That objective is achieved via simple extensions system. Extensions are JavaScript classes that implement particuar methods to deliver the data or modify existing data.

Each extension can extend GraphQL configuration by providing its own config. When all extensions are instantiated FalconServer asks each and every extension for the configuration, combines all the received configurations and passes the combined configuration to Apollo Server configuration. 

During startup Falcon Server calls method `getGraphQLConfig()` method that should return configuration object that provides configuration for the Apollo Server. The following options are implemented:
 * `typeDefs`: <`Object`> - gql expression with type definitions - helpful especially when extension needs to extend a type defined by other extension
 * `schema`: <`Object`> - GrahQL schema generated by [makeExecutableSchema()](https://www.apollographql.com/docs/graphql-tools/schema-stitching.html) or [makeRemoteExecutableSchema()](https://www.apollographql.com/docs/graphql-tools/remote-schemas.html). Passing that option will override `typeDefs` property
 * `resolvers`: <`Object`> - map with resolvers required by defined data types
 * `context`: <`Function`> - function that modifies GraphQL context passed to resolvers during execution
 * `dataSources`: <`Object`> - map with data sources that can be used by resolvers

All the values passed via `typeDefs` and `schema` properties will be merged using [Apollo's schema stitching mechamism](https://www.apollographql.com/docs/graphql-tools/schema-stitching.html)