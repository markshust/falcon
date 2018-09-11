import { ApolloLink } from 'apollo-link';
import ApolloClient from '../service/ApolloClient';

/**
 * Apollo Client Provider middleware, sets ApolloClinet on ctx.state.client
 * @param {object} configSchema configuration Apollo Schema
 * @param {object} clientApolloSchema Apollo Link state config
 * @return {function(ctx: object, next: function): Promise<void>} Koa middleware function
 */
export default ({ configSchema, clientApolloSchema }) => async (ctx, next) => {
  const { serverTiming } = ctx.state;

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

    const qTimer = serverTiming.start(`> ${operation.query.definitions[0].operation}: ${name}`);
    return forward(operation).map(result => {
      serverTiming.stop(qTimer);
      return result;
    });
  });

  const client = new ApolloClient({
    clientState: {
      defaults: {
        ...configSchema.defaults,
        ...clientApolloSchema.defaults
      },
      resolvers: { ...clientApolloSchema.resolvers }
    },
    extraLinks: [profileMiddleware]
  });

  ctx.state.client = client;

  return next();
};
