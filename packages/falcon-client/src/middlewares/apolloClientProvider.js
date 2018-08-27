import { ApolloLink } from 'apollo-link';
import ApolloClient from '../service/ApolloClient';

/**
 * Apollo Client Provider middleware, sets ApolloClinet on ctx.state.client
 * @param {object} configuration App config
 * @param {object} clientState Apollo Link state config
 * @return {function(ctx: object, next: function): Promise<void>} Koa middleware function
 */
export default ({ configuration, clientState }) => async (ctx, next) => {
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
