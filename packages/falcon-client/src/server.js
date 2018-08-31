import Koa from 'koa';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import Router from 'koa-router';
import Logger from '@deity/falcon-logger';
import apolloClientProvider from './middlewares/apolloClientProvider';
import ssr from './middlewares/ssrMiddleware';
import htmlShellRenderer from './middlewares/htmlShellRendererMiddleware';
import error500 from './middlewares/error500Middleware';
import serverTiming from './middlewares/serverTimingMiddleware';

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
export default params => {
  const { configuration } = params;
  const { config } = configuration;
  Logger.setLogLevel(config.logLevel);

  const router = new Router();
  // Defining middlewares
  const middlewares = [apolloClientProvider(params)];
  if (config.serverSideRendering) {
    middlewares.push(ssr(params));
  }
  middlewares.push(htmlShellRenderer);

  router.get('/*', ...middlewares);

  // Intialize and configure Koa application
  const server = new Koa();
  configuration.onServerCreated(server);

  server
    .use(helmet())
    .use(error500())
    .use(serverTiming())
    .use(serve(`${process.env.RAZZLE_PUBLIC_DIR}`))
    .use(router.routes())
    .use(router.allowedMethods());

  configuration.onServerInitialized(server);

  return server;
};
