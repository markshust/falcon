# Falcon Client

This is a `falcon-client` host for your shop.

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
Runs the compiled app in production.

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

## API contract [TODO]
File `./src/index.js` needs to export:
* `component: React.ReactElement<any>` - valid React element
* `config: Object` - configuration object, with possible settings listed below
  * `usePwaManifest` - default is `true`
  * `gtmCode` - Google Tag Manager code


optionally you can export following configuration to inject your customisations
* `onServerCreated(server: Koa)` - handler invoked immediately after koa server creation
* `onServerInitialized(server: Koa)` - handler invoked immediately after koa server setup (when middlewares like handling errors, serving static files and routes were seted up)
* `onServerStarted(server: Koa)` - handler invoked when koa server started with no errors

## Environment Variables
### Build-time Variables
* `process.env.NODE_ENV` - `development` or `production`
* `process.env.VERBOSE`- default is `false`, setting this to true will not clear the console when you make edits in development (useful for debugging).
* `process.env.PORT`- default is `3000`, unless changed
* `process.env.HOST`- default is `0.0.0.0`

## Internal Server Error page
`falcon-client` provide default error page for http 500 error. You can override it and provide your own by placing `500.http` file in `src/views/errors/` directory.

## Maintenance page
<!-- `falcon-client` provide default maintenance page. You can override it and provide your own by placing `index.html` file in `src/views/maintenance/` directory. To switch app to maintenance mode, you need to put `maintenance.flag` file into app root directory. -->

## Idea behind the `falcon-server` [TODO]
`falcon-client` is a application host installed as npm module which cover all necessary configuration ad provide API for Magento, WordPress, Algolia or Elasitc Search. All what you need to do is
* install `falcon-client` in your project
* create entry point file `./src/index.js` according to [API contract](#api-contract).
* start your app `npm falcon-client dev`
