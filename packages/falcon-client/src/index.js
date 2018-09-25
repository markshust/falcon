import http from 'http';
import Logger from '@deity/falcon-logger';

function falconWebServer() {
  const server = require('./server').default;
  const app = require('./clientApp');
  const configuration = require('./clientApp/configuration').default;
  // eslint-disable-next-line
  const assetsManifest = require(process.env.RAZZLE_ASSETS_MANIFEST);

  /**
   * Creates an instance of Falcon web server
   * @param {ServerAppConfig} props Application parameters
   * @return {WebServer} Falcon web server
   */
  return server({
    App: app.default,
    clientApolloSchema: app.clientApolloSchema,
    configuration,
    webpackAssets: {
      clientJs: assetsManifest.client.js,
      clientCss: assetsManifest.client.css,
      vendorsJs: assetsManifest.vendors.js,
      webmanifest: assetsManifest[''].webmanifest
    }
  });
}

// Use `app#callback()` method here instead of directly
// passing `app` as an argument to `createServer` (or use `app#listen()` instead)
// @see https://github.com/koajs/koa/blob/master/docs/api/index.md#appcallback

const server = falconWebServer();
let currentWebServerHandler = server.callback();

const httpServer = http.createServer(currentWebServerHandler);
httpServer.listen(process.env.PORT || 3000, error => {
  if (error) {
    Logger.error(error);
  }

  Logger.log('🚀  started');
  server.started();
});

if (module.hot) {
  Logger.log('✅  Server-side HMR Enabled!');

  module.hot.accept(
    ['./server', './clientApp', './clientApp/configuration', process.env.RAZZLE_ASSETS_MANIFEST],
    () => {
      Logger.log('🔁  HMR Reloading server...');

      httpServer.removeListener('request', currentWebServerHandler);

      const newHandler = falconWebServer().callback();

      httpServer.on('request', newHandler);
      currentWebServerHandler = newHandler;
    }
  );
}
