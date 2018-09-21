import http from 'http';
import Logger from '@deity/falcon-logger';
import falconWebServer from './server';

// Use `app#callback()` method here instead of directly
// passing `app` as an argument to `createServer` (or use `app#listen()` instead)
// @see https://github.com/koajs/koa/blob/master/docs/api/index.md#appcallback

let currentWebServerHandler = falconWebServer.callback();

const server = http.createServer(currentWebServerHandler);
server.listen(process.env.PORT || 3000, error => {
  if (error) {
    Logger.error(error);
  }

  Logger.log('🚀  started');
  falconWebServer.started();
});

if (module.hot) {
  Logger.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    Logger.log('🔁  HMR Reloading server...');

    server.removeListener('request', currentWebServerHandler);

    const newFalconWebServer = require('./server').default;
    const newHandler = newFalconWebServer.callback();

    server.on('request', newHandler);
    currentWebServerHandler = newHandler;
  });
}
