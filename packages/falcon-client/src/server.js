import fetch from 'isomorphic-unfetch';
import Koa from 'koa';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import Router from 'koa-router';
import Logger from '@deity/falcon-logger';
import ClientApp from './clientApp';
import ssr from './middlewares/ssrMiddleware';
import htmlShellRenderer from './middlewares/htmlShellRendererMiddleware';
import error500 from './middlewares/error500Middleware';

Logger.setLogLevel(ClientApp.config.logLevel);

// eslint-disable-next-line
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

// Polyfill fetch() on the server (used by apollo-client)
global.fetch = fetch;

// Initialize `koa-router` and setup a route listening on `GET /*`
// Logic has been splitted into two chained middleware functions
// @see https://github.com/alexmingoia/koa-router#multiple-middleware
const router = new Router();
router.get('/*', ssr, htmlShellRenderer);

// Intialize and configure Koa application
const server = new Koa();
ClientApp.onServerCreated(server);

server
  .use(error500)
  // `koa-helmet` provides security headers to help prevent common, well known attacks
  // @see https://helmetjs.github.io/
  .use(helmet())
  .use(serve(process.env.RAZZLE_PUBLIC_DIR))
  .use(router.routes())
  .use(router.allowedMethods());

ClientApp.onServerInitialized(server);

export default server;
