# ApiContainer

The main purpose of `ApiContainer` is to store, initialize and manage all
provided APIs from the configuration. It also collects REST endpoints,
required by the API to handle requests in old-fashioned way (for example -
processing payment callbacks).

## `new ApiContainer(apis: ApiInstanceConfig[])`

The constructor expects to receive a list of [`ApiInstanceConfig`](#ApiInstanceConfig-type) objects

## `apiContainer.registerApis(apis: ApiInstanceConfig[])`

This method registers provided APIs into `apiContainer.dataSources` Map.
Constructor will create a new Map and call this method inside itself, so
any further manual calls of `registerApis` method will add new API DataSources to it.

All endpoints that were collected from API DataSources will be stored in `apiContainer.endpoints` property.

### `ApiInstanceConfig` type

- `name: string` - Api short-name (example: `api-wordpress`)
- `package: string` - Node package path (example: `@deity/falcon-wordpress-api`)
- `config: object` - Config object to be passed to Api Instance constructor
