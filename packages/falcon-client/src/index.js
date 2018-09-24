import http from 'http';
import Logger from '@deity/falcon-logger';
import server from './server/instance';

// Use `app#callback()` method here instead of directly
// passing `app` as an argument to `createServer` (or use `app#listen()` instead)
// @see https://github.com/koajs/koa/blob/master/docs/api/index.md#appcallback

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

  module.hot.accept('./server/instance', () => {
    Logger.log('🔁  HMR Reloading server...');

    httpServer.removeListener('request', currentWebServerHandler);

    const newFalconWebServer = require('./server/instance').default;
    const newHandler = newFalconWebServer.callback();

    httpServer.on('request', newHandler);
    currentWebServerHandler = newHandler;
  });
}
