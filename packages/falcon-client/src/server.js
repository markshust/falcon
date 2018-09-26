import Koa from 'koa';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import Router from 'koa-router';
import compress from 'koa-compress';
import Logger from '@deity/falcon-logger';
import error500 from './middlewares/error500Middleware';
import serverTiming from './middlewares/serverTimingMiddleware';
import { renderAppShell, renderApp } from './middlewares/routes';

/**
 * Creates an instance of Falcon web server
 * @param {ServerAppConfig} props Application parameters
 * @return {WebServer} Falcon web server
 */
export default ({ App, clientApolloSchema, configuration, webpackAssets }) => {
  const { config } = configuration;
  Logger.setLogLevel(config.logLevel);

  const instance = new Koa();
  configuration.onServerCreated(instance);

  const publicDir = process.env.RAZZLE_PUBLIC_DIR;
  const router = new Router();
  router.get('/sw.js', serve(publicDir, { maxage: 0 }));
  router.get('/static/*', serve(publicDir, { maxage: process.env.NODE_ENV === 'production' ? 31536000000 : 0 }));
  router.get('/*', serve(publicDir));
  router.get('/app-shell', ...renderAppShell({ configuration, webpackAssets }));
  router.get('/*', ...renderApp({ App, clientApolloSchema, configuration, webpackAssets }));

  instance
    .use(helmet())
    .use(error500())
    .use(serverTiming())
    .use(compress())
    .use(router.routes())
    .use(router.allowedMethods());

  configuration.onServerInitialized(instance);

  return {
    instance,
    callback: () => instance.callback(),
    started: () => configuration.onServerStarted(instance)
  };
};

/**
 * @typedef {object} ServerAppConfig
 * @property {function} App Root application component
 * @property {object} configuration Initial configuration
 * @property {object} clientApolloSchema Apollo State object
 * @property {object} webpackAssets webpack assets
 */

/**
 * @typedef {object} WebServer
 * @property {Koa} instance Server instance
 * @property {function} callback Initial configuration
 * @property {object} clientApolloSchema Apollo State object
 */
