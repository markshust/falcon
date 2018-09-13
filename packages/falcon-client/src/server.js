import Koa from 'koa';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import Router from 'koa-router';
import compress from 'koa-compress';
import Logger from '@deity/falcon-logger';
import apolloClientProvider from './middlewares/apolloClientProvider';
import ssr from './middlewares/ssrMiddleware';
import htmlShellRenderer from './middlewares/htmlShellRendererMiddleware';
import error500 from './middlewares/error500Middleware';
import serverTiming from './middlewares/serverTimingMiddleware';
import i18next from './middlewares/i18nextMiddleware';

/**
 * @typedef {object} ServerAppConfig
 * @property {function} App Root application component
 * @property {object} configuration Initial configuration
 * @property {object} clientApolloSchema Apollo State object
 * @property {object} i18nResources Initial internationalization resources
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



  

  router.get(
    '/app-shell',
    ...[apolloClientProvider({ clientStates: { configSchema: params.configuration.configSchema } }), htmlShellRenderer]
  );

  const renderAppRouteMiddlewares = [];
  renderAppRouteMiddlewares.push(
    apolloClientProvider({
      clientStates: {
        configSchema: params.configuration.configSchema,
        clientApolloSchema: params.clientApolloSchema
      }
    })
  );
  renderAppRouteMiddlewares.push(i18next({ ...config.i18n, resources: params.i18nResources }));
  if (config.serverSideRendering) {
    renderAppRouteMiddlewares.push(ssr(params));
  }
  renderAppRouteMiddlewares.push(htmlShellRenderer);
  router.get('/*', ...renderAppRouteMiddlewares);

  // Initialize and configure Koa application
  const server = new Koa();
  configuration.onServerCreated(server);

  server
    .use(helmet())
    .use(error500())
    .use(serverTiming())
    .use(compress())
    .use(serve(process.env.RAZZLE_PUBLIC_DIR))
    .use(router.routes())
    .use(router.allowedMethods());

  configuration.onServerInitialized(server);

  return server;
};
