import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import createMiddleware from './middleware/clientMiddleware';

export default function createStore(history, client, data) {
  // Sync dispatched route actions to the history

  const reduxRouterMiddleware = routerMiddleware(history);
  let middleware = [createMiddleware(client), thunk, reduxRouterMiddleware];

  if (__DEVELOPMENT__ && __CLIENT__) {
    const logger = require('redux-logger');
    const collapsedActionTypes = [
      '@@redux-form/INITIALIZE',
      '@@redux-form/REGISTER_FIELD',
      '@@redux-form/FOCUS',
      '@@redux-form/BLUR',
      '@@redux-form/CHANGE'
    ];
    middleware = [
      ...middleware,
      logger.createLogger({
        collapsed: (getState, action) => collapsedActionTypes.indexOf(action.type) > -1
      })
    ];
  }

  let finalCreateStore;
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    /* eslint import/no-extraneous-dependencies: [0] */
    const { persistState } = require('redux-devtools');
    const DevTools = require('containers/DevTools/DevTools');
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  const reducer = require('./modules/reducer');
  const store = finalCreateStore(reducer, data);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'));
    });
  }

  return store;
}
