import http from 'http';
import Logger from '@deity/falcon-logger';
import appServer from './server';
import App, { clientState } from './clientApp';
import configuration from './clientApp/configuration';

const app = appServer({
  App,
  clientState,
  configuration
});
// Use `app#callback()` method here instead of directly
// passing `app` as an argument to `createServer` (or use `app#listen()` instead)
// @see https://github.com/koajs/koa/blob/master/docs/api/index.md#appcallback
let currentHandler = app.callback();
const server = http.createServer(currentHandler);

server.listen(process.env.PORT || 3000, error => {
  if (error) {
    Logger.error(error);
  }

  Logger.log('🚀  started');
  configuration.onServerStarted(app);
});

if (module.hot) {
  Logger.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    Logger.log('🔁  HMR Reloading `./server`...');

    server.removeListener('request', currentHandler);
    const newHandler = require('./server')
      .default({ App, clientState, configuration })
      .callback();
    server.on('request', newHandler);
    currentHandler = newHandler;
  });
}
