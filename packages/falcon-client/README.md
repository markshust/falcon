# Falcon Client

This is a `@deity/falcon-client` host for your shop.

## Installation

```bash
$ npm install @deity/falcon-client
```

## Quick Start [TODO]

```bash
npm install -g create-falcon-app

create-falcon-app my-app
cd my-app
npm dev
```

Then open http://localhost:3000/ to see your app.

**That's it**. Just start editing `./src/App.js` and go!

## How to use

Download the [Shop with Blog](https://github.com/deity-io/falcon/tree/master/examples/shop-with-blog/client)
example [or clone the whole project](https://github.com/deity-io/falcon.git):

Install it and run:

```bash
yarn install
yarn dev
```

## Commands

### `npm start` or `yarn start`

Runs the project in development mode
You can view your application at `http://localhost:3000`

The page will reload if you make edits.

### `npm run build` or `yarn build`

Builds the app for production to the build folder.

The build is minified and the filenames include the hashes. Your app is ready to be deployed!

### `npm run start:prod` or `yarn start:prod`

Runs the compiled app in production mode.

You can again view your application at `http://localhost:3000`

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

### `npm start -- --inspect=[host:port]` or `yarn start -- --inspect=[host:port]`

To debug the node server, you can use `razzle start --inspect`. This will start the node server and enable the inspector agent. The `=[host:port]` is optional and defaults to `=127.0.0.1:9229`. For more information, see [this](https://nodejs.org/en/docs/guides/debugging-getting-started/).

### `npm start -- --inspect-brk=[host:port]` or `yarn start -- --inspect-brk=[host:port]`

This is the same as --inspect, but will also break before user code starts. (to give a debugger time to attach before early code runs) For more information, see [this](https://nodejs.org/en/docs/guides/debugging-getting-started/).

### `rs`

If your application is running, and you need to manually restart your server, you do not need to completely kill and rebundle your application. Instead you can just type `rs` and press enter in terminal.

## API contract

Application needs to have three files `index.js`, `falcon-client.config.js` and `razzle.config.js`. Each of them should be placed in application root directory.

### `index.js`

This is an application entry point which needs to export the following:

- `default: React.ReactElement<any>` - valid React element
- `clientApolloSchema` - Apollo Schema (TODO should not be required!)

### `falcon-client.config.js`

- (TODO) `config: Object` - configuration object, with possible settings listed below
  - `serverSideRendering` - switch to control whether the Server Side Rendering is enabled, default is `true`
  - `usePwaManifest` - default is `true`
  - `gtmCode` - Google Tag Manager code

optionally you can export following configuration to inject your customization

- `onServerCreated(server: Koa)` - handler invoked immediately after koa server creation
- `onServerInitialized(server: Koa)` - handler invoked immediately after koa server setup (when middlewares like handling errors, serving static files and routes were set up)
- `onServerStarted(server: Koa)` - handler invoked when koa server started with no errors

### `razzle.config.js`

TODO

## Environment Variables

### Build-time Variables

- `process.env.NODE_ENV` - `development` or `production`
- `process.env.VERBOSE`- default is `false`, setting this to true will not clear the console when you make edits in development (useful for debugging).
- `process.env.PORT`- default is `3000`, unless changed
- `process.env.HOST`- default is `0.0.0.0`

## Internationalization

Internationalization is based on [i18next](https://www.i18next.com/).

All custom i18n resources should be placed in `./i18n` directory, and folder structure should follow pattern `{{lng}}/{{ns}}.json`. Which means each language needs to have own directory with `json` file per namespace.

Default namespace is `common` and there is also fallback configured to it, in case if translation key can not be found in namespaces defined in `translate()` HoC from `react-i18next` module.

During application build, default resources (if configured) will be merged with custom from `./i18n` directory and stored in `./public/i18n/`. Which means that you should not edit any of these files as your changes will be overridden.

### Configuration

Configuration options base on [i18next](https://www.i18next.com/overview/configuration-options) and you can change them via configuration `config.i18n` exported from `falcon-client.config.js`

- `lng: string` - default application language
- `fallbackLng: string` - language to use if translations in selected language are not available
- `whitelist: string[]` - available languages, it may be be narrowed, if installed extensions does not support all of specified
- `ns: string[]` - namespaces used by application
- `debug: boolean` - `i18next` debug mode switch

### Using default resources

To use default resources you need to install `@deity/falcon-i18n` npm module (or any other compatible) which contains default translations

```bash
npm install --save @deity/falcon-i18n
```

Then in `razzle.config.js` file you need to update `razzlePluginFalconClient` plugin configuration. Add `@deity/falcon-i18n` package name into `resourcePackages` array.

Imported package (like `@deity/falcon-i18n`) can contain more languages and/or namespaces than you are interested in. So if you don't want to use all of them (to save bundle size, or just not to use some namespace as it's not relevant to your project) you can filter them out by using `filter` option - that will instruct webpack to skip items not listed in the `filter` property.

```
razzlePluginFalconClient({
  i18n: {
    resourcePackages: ['@deity/falcon-i18n'],
    filter: {
      lng: ['en'],
      ns: ['common', 'blog']
    }
  }
})
```

Above example configuration will deliver to your project default `common` and `blog` namespaces from English language.

## Internal Server Error page

`falcon-client` provide default error page for http 500 error. You can override it and provide your own by placing `500.http` file in `./views/errors/` directory.

## Maintenance page [TODO]

<!-- `falcon-client` provide default maintenance page. You can override it and provide your own by placing `index.html` file in `src/views/maintenance/` directory. To switch app to maintenance mode, you need to put `maintenance.flag` file into app root directory. -->

## Testing

### Mocking `falcon-client`

`falcon-client` exposes `FalconClientMock` component which allows you to setup application context inside unit test environment.
`FalconClientMock` can receive props for mock version of React context provider components used by `falcon-client` internally:

- `apollo: Object` - props for `MockProvider` component from `react-apollo`
- `router: Object` props for `MemoryRouter` component from `react-router-dom`
- `asyncComponent: Object` - props for `AsyncComponentProvider` component from `react-async-component`
- `i18next: Object` - props for `I18nextProvider` component from `react-i18next`

example unit test with `FalconClientMock` :

```
import { FalconClientMock } from '@deity/falcon-client/test-utils';

describe('<Component />', () => {
  test('renders without exploding', () => {

    ReactDOM.render(
      <FalconClientMock>
        {
          // yours component <Component />
        }
      </FalconClientMock>,
      document.createElement('div')
    );
  });
});
```

## Idea behind the `falcon-server` [TODO]

`falcon-client` is a application host installed as npm module which cover all necessary configuration ad provide API for Magento, WordPress, Algolia or Elasitc Search. All what you need to do is

- install `falcon-client` in your project
- create entry point file `./src/index.js` according to [API contract](#api-contract).
- start your app `npm falcon-client dev`
