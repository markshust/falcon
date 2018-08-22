import { ApolloLink } from 'apollo-link';
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
  const { timings } = ctx.state;

  const profileMiddleware = new ApolloLink((operation, forward) => {
    let name = operation.operationName;
    try {
      if (!name) {
        name = operation.query.definitions[0].selectionSet.selections
          .map(item => (item.kind === 'Field' ? item.name.value : ''))
          .join(', ');
      }
    } catch (e) {
      name = '<unknown>';
    }

    const qTimer = timings.startTimer(`> ${operation.query.definitions[0].operation}: ${name}`);
    return forward(operation).map(result => {
      timings.stopTimer(qTimer);
      return result;
    });
  });

  const client = new ApolloClient({
    clientState: {
      defaults: {
        ...configuration.configState.defaults,
        ...clientState.defaults
      },
      resolvers: { ...clientState.resolvers }
    },
    extraLinks: [profileMiddleware]
  });

  ctx.state.client = client;

  return next();
};
