import apolloClientProvider from './apolloClientProvider';
import ssr from './ssrMiddleware';
import helmet from './helmetMiddleware';
import appShell from './appShellMiddleware';
import i18next from './i18nextMiddleware';

/**
 * @typedef {object} RenderAppShell
 * @property {object} configuration Initial configuration
 * @property {object} webpackAssets webpack assets
 */

/**
 * Configure App Shell rendering middlewares
 * @param {RenderAppShell} params params
 * @return {function(ctx: object, next: function)[]} Koa middlewares
 */
export function renderAppShell({ configuration, webpackAssets }) {
  const { config, configSchema } = configuration;
  const { useWebManifest } = config;

  if (!useWebManifest) {
    webpackAssets.webmanifest = '';
  }

  return [apolloClientProvider({ clientStates: { configSchema } }), helmet(), appShell({ webpackAssets })];
}

/**
 * @typedef {object} RenderApp
 * @property {function} App React Component
 * @property {object} configuration Initial configuration
 * @property {object} clientApolloSchema Apollo State object
 * @property {object} webpackAssets webpack assets
 */

/**
 * Configure App rendering middlewares
 * @param {RenderApp} params params
 * @return {function(ctx: object, next: function)[]} Koa middlewares
 */
export function renderApp({ configuration, clientApolloSchema, App, webpackAssets }) {
  const { config, configSchema } = configuration;
  const { i18n, serverSideRendering, useWebManifest } = config;

  if (!useWebManifest) {
    webpackAssets.webmanifest = '';
  }

  return [
    apolloClientProvider({
      clientStates: {
        configSchema,
        clientApolloSchema
      }
    }),
    i18next({ ...i18n }),
    serverSideRendering && ssr({ App }),
    appShell({ webpackAssets })
  ].filter(x => x);
}
