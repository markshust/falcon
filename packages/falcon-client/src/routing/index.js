import webpackAssets from './webpackAssetsMiddleware';
import apolloClientProvider from './apolloClientProvider';
import ssr from './ssrMiddleware';
import helmet from './helmetMiddleware';
import appShell from './appShellMiddleware';
import i18next from './i18nextMiddleware';

/**
 * Configure App Shell rendering middlewares
 * @param {{ configuration: object }} params configuration
 * @return {function(ctx: object, next: function)[]} Koa middlewares
 */
export function renderAppShell({ configuration }) {
  const { config, configSchema } = configuration;

  return [
    webpackAssets({ includeWebManifest: config.useWebManifest }),
    apolloClientProvider({ clientStates: { configSchema } }),
    helmet(),
    appShell()
  ];
}

/**
 * @typedef {object} RenderApp
 * @property {function} App React Component
 * @property {object} configuration Initial configuration
 * @property {object} clientApolloSchema Apollo State object
 */

/**
 * Configure App rendering middlewares
 * @param {RenderApp} params configuration
 * @return {function(ctx: object, next: function)[]} Koa middlewares
 */
export function renderApp({ configuration, clientApolloSchema, App }) {
  const { config, configSchema } = configuration;
  const { i18n, serverSideRendering } = config;

  return [
    webpackAssets({ includeWebManifest: config.useWebManifest }),
    apolloClientProvider({
      clientStates: {
        configSchema,
        clientApolloSchema
      }
    }),
    i18next({ ...i18n }),
    serverSideRendering && ssr({ App }),
    appShell()
  ].filter(x => x);
}
