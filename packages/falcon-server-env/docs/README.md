# Falcon Server Env

## ApiDataSource

## Extension

`src/models/Extension` is a base class for any extension that is being used
by Falcon Server Application. It adds a few helpful methods to provide
a seamless integration with Falcon Server apps.

## Using ApiDataSource together with Extension

```javascript
const { Extension } = require('@deity/falcon-server-env');

class MyExtension extends Extension {

  async getGraphQLConfig() {
    return {};
  }
}
```
