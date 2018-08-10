import http from 'http';
import ClientApp from '@clientApp';
import app from './server';

// Use `app#callback()` method here instead of directly
// passing `app` as an argument to `createServer` (or use `app#listen()` instead)
// @see https://github.com/koajs/koa/blob/master/docs/api/index.md#appcallback
let currentHandler = app.callback();
const server = http.createServer(currentHandler);

server.listen(process.env.PORT || 3000, error => {
  if (error) {
    console.log(error);
  }

  console.log('🚀 started');
  if (ClientApp.onServerStarted) {
    ClientApp.onServerStarted(server);
  }
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');
    server.removeListener('request', currentHandler);
    const newHandler = require('./server').default.callback();
    server.on('request', newHandler);
    currentHandler = newHandler;
  });
}
