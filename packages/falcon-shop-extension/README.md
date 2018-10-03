# Falcon Shop Extension

## Overview and installation
This extension provides basic features that allow for shop implementation. 

The main part of the extension is [GraphQL Schema](./src/schema.grapqhql) that defines data types, queries and mutations required by the shop. The extension doesn't depend on the backend platform but tries to provide a layer of abstraction on top of shop functionality.

To enable it in your Falcon-based application you have to provide API that delivers resolvers for queries and mutations as this extension delegates execution of those to API class that's responsible for communication with 3rd party backend. For the example see [Magento2Api](https://github.com/deity-io/falcon/tree/master/packages/falcon-magento2-api) that provides a communication layer with Magento2 backend.

To add this extension to your Falcon-based app install it in the server directory: 

with yarn:
```bash
# installs shop extension
yarn add @deity/falcon-shop-extension
# installs magento2 api required for communication with magento
yarn add @deity/falcon-shop-extension
```

or with npm:
```bash
# installs shop extension
npm install --save @deity/falcon-shop-extension
# installs magento2 api required for communication with magento
npm install --save @deity/falcon-shop-extension
```

and add extension and api to the configuration of the server:
```js
{
  "extensions": [
    // enable extension by adding it to "extensions" array
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
