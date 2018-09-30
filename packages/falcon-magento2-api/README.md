# Falcon Magento2 API

## Overview and installation
This API class realizes communication with Magento2 backend.

It provides resolvers for queries and mutations required by [Falcon Shop Extension](https://github.com/deity-io/falcon/tree/master/packages/falcon-shop-extension)

To add this api to your Falcon-based app install it in the server directory: 

with yarn:
```bash
# install magento2 api
yarn add @deity/falcon-magento2-api
# install shop extension that will use that api
yarn add @deity/falcon-shop-extension
```

or with npm:
```bash
# install magento2 api
npm install --save @deity/falcon-magento2-api
# install shop extension that will use that api
npm install --save @deity/falcon-shop-extension
```

and add extension and api to the configuration of the server:
```js
{
  "extensions": [
    // enable shop extension by adding it to "extensions" array
    {
      "package": "@deity/falcon-shop-extension",
      "config": {
        "api": "api-magento2" // must match api name string set in api.name property below
      }
    }
  ],
  "apis": [
    // provide api that will be used by magneto
    {
      "name": "api-magento2", // must match name from shop-extension configuration 
      "package": "@deity/falcon-magento2-api",
      "config": {
        // your magento2 api configuration
      }
    }
  ]
}
```

## Implementation notes
This api uses Deity Falcon Module for Magento2 (#todo: add link to the module).

### Livecycle of the GrahpQL request
This is a short overview of the way authentication between Falcon Magento2 API and Magento2 backend works. 

Falcon Magento2 API provides implementation for endpoints that require authorization (customer related data) as well as endpoints that don't require customer to be authenticated (product catalog etc).

Once user signs in with his Magento2 credentials his access token is stored in the session so it can be used for interaction with Magneto2.

When GraphQL request comes in [Falcon Server](https://github.com/deity-io/falcon/tree/master/packages/falcon-server) invokes context handlers for all the extensions. [Falcon Shop Extension](https://github.com/deity-io/falcon/tree/master/packages/falcon-shop-extension) calls `createContextData(context)` of the connected API instance (in this case it's Falcon Magento2 API) and passes GraphQL execution context as the param to that method. That way API instance can fill in context with its own data that can be reused during query execution. 

Falcon Magento2 API gets then data from the session (which is available as `context.req.session`) and puts it under `magento2` property in context. That way all the required data (like auth token, currency, storeToken) are available in `this.context.magento2` during query processing.