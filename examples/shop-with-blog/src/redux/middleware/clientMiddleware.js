import Logger from 'falcon-core/helpers/Logger';
import uniq from 'lodash/uniq';

export default function clientMiddleware(client) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const { query, types, ...rest } = action; // eslint-disable-line no-redeclare
    let { promise } = action;
    if (!promise && !query) {
      return next(action);
    }

    // todo catch infinite loop here

    const [REQUEST, SUCCESS, FAILURE] = types;

    try {
      next({ ...rest, type: REQUEST });

      if (query) {
        const { variables } = action;
        promise = () =>
          client.query({ query, variables }).then(res => {
            if (res.data) {
              const keys = Object.keys(res.data);
              if (keys.length === 1) {
                return res.data[keys[0]];
              }
            }

            return res;
          });
      }

      return promise(client)
        .then(result => {
          if (result && result.errors) {
            // todo move formatting to seperate function
            const e = new Error(`Query failed:
              ${uniq(result.errors.map(error => error.message)).join('\n')} 
            `);

            throw e;
          }
          return next({ ...rest, result, type: SUCCESS });
        })
        .catch(error => {
          Logger.error(error);
          next({ ...rest, error, type: FAILURE });
          return error;
        });
    } catch (error) {
      Logger.error(error);
      throw new Error('Redux error');
    }
  };
}
