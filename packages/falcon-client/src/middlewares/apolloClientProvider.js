import ApolloClient from '@hostSrc/service/ApolloClient';
import { clientState } from '@hostSrc/clientApp';
import configuration from '@hostSrc/clientApp/configuration';

/**
 * Apollo Client Provider middleware.
 * sets ApolloClinet on ctx.state.client
 * @async
 * @param {string} ctx - Koa context.
 * @param {string} next - Koa next.
 * @returns {Promise<void>} - next middleware
 */
export default async (ctx, next) => {
  const client = new ApolloClient({
    clientState: {
      defaults: {
        ...{
          config: {
            __typename: 'Config',
            ...configuration.config
          }
        },
        ...clientState.defaults
      },
      resolvers: { ...clientState.resolvers }
    }
  });

  ctx.state.client = client;

  return next();
};
