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

  const server = new Koa();
  configuration.onServerCreated(server);

  const publicDir = process.env.RAZZLE_PUBLIC_DIR;
  const router = new Router();
  router.get('/sw.js', serve(publicDir, { maxage: 0 }));
  router.get('/static/*', serve(publicDir, { maxage: process.env.NODE_ENV === 'production' ? 31536000000 : 0 }));
  router.get('/*', serve(publicDir));
  router.get('/app-shell', ...renderAppShell({ configuration }));
  router.get('/*', ...renderApp({ configuration, clientApolloSchema, App }));

  server
    .use(helmet())
    .use(error500())
    .use(serverTiming())
    .use(compress())
    .use(router.routes())
    .use(router.allowedMethods());

  configuration.onServerInitialized(server);

  return server;
};
