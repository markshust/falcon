import http from 'http';
import Logger from '@deity/falcon-logger';
import falconWebServer from './server';

// Use `app#callback()` method here instead of directly
// passing `app` as an argument to `createServer` (or use `app#listen()` instead)
// @see https://github.com/koajs/koa/blob/master/docs/api/index.md#appcallback

const webServer = falconWebServer();
let currentWebServerHandler = webServer.callback();

const server = http.createServer(currentWebServerHandler);
server.listen(process.env.PORT || 3000, error => {
  if (error) {
    Logger.error(error);
  }

  Logger.log('🚀  started');
  webServer.started();
});

if (module.hot) {
  Logger.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    Logger.log('🔁  HMR Reloading server...');

    server.removeListener('request', currentWebServerHandler);

    const newWebServer = require('./server').default();
    const newHandler = newWebServer.callback();

    server.on('request', newHandler);
    currentWebServerHandler = newHandler;
  });
}
