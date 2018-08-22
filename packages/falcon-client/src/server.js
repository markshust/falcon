import Koa from 'koa';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import Router from 'koa-router';
import Logger from '@deity/falcon-logger';
import configuration from '@hostSrc/clientApp/configuration';
import apolloClientProvider from '@hostSrc/middlewares/apolloClientProvider';
import ssr from '@hostSrc/middlewares/ssrMiddleware';
import htmlShellRenderer from '@hostSrc/middlewares/htmlShellRendererMiddleware';
import error500 from '@hostSrc/middlewares/error500Middleware';
import timing from '@hostSrc/middlewares/timingMiddleware';

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
  .use(timing())
  .use(serve(process.env.RAZZLE_PUBLIC_DIR))
  .use(router.routes())
  .use(router.allowedMethods());

configuration.onServerInitialized(server);

export default server;
