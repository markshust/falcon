import apolloClientProvider from './apolloClientProvider';
import ssr from './ssrMiddleware';
import appShell from './appShellMiddleware';
import i18next from './i18nextMiddleware';

/**
 * Configure App Shell rendering middlewares
 * @param {{ configuration: object }} params configuration
 * @return {function(ctx: object, next: function)[]} Koa middlewares
 */
export function renderAppShell({ configuration }) {
  const { configSchema } = configuration;

  return [apolloClientProvider({ clientStates: { configSchema } }), appShell()];
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

  const middlewares = [];
  middlewares.push(
    apolloClientProvider({
      clientStates: {
        configSchema,
        clientApolloSchema
      }
    })
  );
  middlewares.push(i18next({ ...config.i18n }));
  if (config.serverSideRendering) {
    middlewares.push(ssr({ App }));
  }
  middlewares.push(appShell());

  return middlewares;
}
