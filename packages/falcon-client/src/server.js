import Koa from 'koa';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import Router from 'koa-router';
import compress from 'koa-compress';
import Logger from '@deity/falcon-logger';
import App, { clientApolloSchema } from './clientApp';
import configuration from './clientApp/configuration';
import error500 from './middlewares/error500Middleware';
import serverTiming from './middlewares/serverTimingMiddleware';
import { renderAppShell, renderApp } from './routing';

/**
 * Creates an instance of Koa server
 * @param {ServerAppConfig} props Application parameters
 * @return {Koa} Server instance
 */
function createInstance(props) {
  const { config } = props.configuration;
  Logger.setLogLevel(config.logLevel);

  const server = new Koa();
  props.configuration.onServerCreated(server);

  const publicDir = process.env.RAZZLE_PUBLIC_DIR;
  const router = new Router();
  router.get('/sw.js', serve(publicDir, { maxage: 0 }));
  router.get('/static/*', serve(publicDir, { maxage: process.env.NODE_ENV === 'production' ? 31536000000 : 0 }));
  router.get('/*', serve(publicDir));
  router.get('/app-shell', ...renderAppShell({ configuration: props.configuration }));
  router.get('/*', ...renderApp(props));

  server
    .use(helmet())
    .use(error500())
    .use(serverTiming())
    .use(compress())
    .use(router.routes())
    .use(router.allowedMethods());

  return server;
}

/**
 * Creates an instance of Falcon web server
 * @param {ServerAppConfig} props Application parameters
 * @return {WebServer} Falcon web server
 */
export default (
  props = {
    App,
    clientApolloSchema,
    configuration
  }
) => {
  const instance = createInstance(props);

  props.configuration.onServerInitialized(instance);

  return {
    instance,
    callback: () => instance.callback(),
    started: () => props.configuration.onServerStarted(instance)
  };
};

/**
 * @typedef {object} ServerAppConfig
 * @property {function} App Root application component
 * @property {object} configuration Initial configuration
 * @property {object} clientApolloSchema Apollo State object
 */

/**
 * @typedef {object} WebServer
 * @property {Koa} instance Server instance
 * @property {function} callback Initial configuration
 * @property {object} clientApolloSchema Apollo State object
 */
