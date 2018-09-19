import Koa from 'koa';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import Router from 'koa-router';
import compress from 'koa-compress';
import Logger from '@deity/falcon-logger';
import error500 from './middlewares/error500Middleware';
import serverTiming from './middlewares/serverTimingMiddleware';
import { renderAppShell, renderApp } from './routing';

/**
 * @typedef {object} ServerAppConfig
 * @property {function} App Root application component
 * @property {object} configuration Initial configuration
 * @property {object} clientApolloSchema Apollo State object
 */

/**
 * Creates an instance of Koa server
 * @param {ServerAppConfig} params Application params
 * @return {Koa} Server instance
 */
export default ({ App, clientApolloSchema, configuration }) => {
  const { config } = configuration;
  Logger.setLogLevel(config.logLevel);

  const staticFiles = new Router();
  staticFiles.get('/sw.js', serve(process.env.RAZZLE_PUBLIC_DIR, { maxage: 0 }));
  staticFiles.get('/static/*', serve(process.env.RAZZLE_PUBLIC_DIR, { maxage: 60 * 60 * 24 /* 1d */ }));

  const router = new Router();
  router.get('/app-shell', ...renderAppShell({ configuration }));
  router.get('/*', ...renderApp({ configuration, clientApolloSchema, App }));

  const server = new Koa();
  configuration.onServerCreated(server);

  server
    .use(helmet())
    .use(error500())
    .use(serverTiming())
    .use(compress())
    .use(staticFiles.routes())
    .use(serve(process.env.RAZZLE_PUBLIC_DIR))
    .use(router.routes())
    .use(router.allowedMethods());

  configuration.onServerInitialized(server);

  return server;
};
