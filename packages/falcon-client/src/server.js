import Koa from 'koa';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import Router from 'koa-router';
import Logger from '@deity/falcon-logger';
import configuration from './clientApp/configuration';
import apolloClientProvider from './middlewares/apolloClientProvider';
import ssr from './middlewares/ssrMiddleware';
import htmlShellRenderer from './middlewares/htmlShellRendererMiddleware';
import error500 from './middlewares/error500Middleware';
import serverTiming from './middlewares/serverTimingMiddleware';

const { config } = configuration;
Logger.setLogLevel(config.logLevel);

const router = new Router();
if (config.serverSideRendering) {
  router.get('/*', apolloClientProvider, ssr, htmlShellRenderer);
} else {
  router.get('/*', apolloClientProvider, htmlShellRenderer);
}

// Intialize and configure Koa application
const server = new Koa();
configuration.onServerCreated(server);

server
  .use(error500)
  // `koa-helmet` provides security headers to help prevent common, well known attacks
  // @see https://helmetjs.github.io/
  .use(helmet())
  .use(serverTiming())
  .use(serve(process.env.RAZZLE_PUBLIC_DIR))
  .use(router.routes())
  .use(router.allowedMethods());

configuration.onServerInitialized(server);

export default server;
