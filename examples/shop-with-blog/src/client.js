/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import { observe } from 'redux-observers';
import ReactDOM from 'react-dom';
import Logger from 'falcon-core/helpers/Logger';
import { trackOrderPlaced } from 'falcon-core/redux/observers/checkout';
import shopObservers from 'falcon-core/redux/observers/shop';
import ApiProxy from 'falcon-core/helpers/ApiProxy';
import ApiBrowser from 'falcon-core/helpers/ApiBrowser';
import i18n from 'falcon-core/i18n/i18nClient';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect } from 'redux-connect';
import { useScroll } from 'react-router-scroll';
import { applyRouterMiddleware, browserHistory, Router, match } from 'react-router';
import getRoutes from './routes';
import createStore from './redux/create';

if (__DEVELOPMENT__) {
  console.time('deity client match');
}

const client = new ApiProxy(new ApiBrowser());

const scrollRouterMiddleware = useScroll(
  (prevRouterProps, { location }) =>
    !prevRouterProps ||
    location.pathname !== prevRouterProps.location.pathname ||
    (location.query && location.query !== prevRouterProps.location.query)
);

const dest = document.getElementById('content');
/* eslint-disable */
const store = createStore(browserHistory, client, window.__data);
/* eslint-enable */
const syncedHistory = syncHistoryWithStore(browserHistory, store);

const state = store.getState();
const { config } = state;
const { gaCode } = config;
const observers = shopObservers();
let ReactGa;

/* eslint-disable */
if (gaCode) {
  // include conditionally - optimize including packages for webpack
  ReactGa = require('react-ga');
}
/* eslint-enable */

if (gaCode) {
  ReactGa.initialize(gaCode, {
    debug: __DEVELOPMENT__,
    gaOptions: {
      siteSpeedSampleRate: 10
    }
  });

  observers.push(trackOrderPlaced(gaCode));
}

observe(store, observers);

const i18nClient = i18n({
  lng: state.wpConfig.activeLanguage,
  ...config.languages
});

function trackPage() {
  if (gaCode) {
    /* eslint-disable */
    ReactGa.set({ page: window.location.pathname });
    ReactGa.pageview(window.location.pathname);
    ReactGa.plugin.require('ecommerce');
    /* eslint-enable */
  }
}
const routes = getRoutes(store);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger
}

match({ history: syncedHistory, routes }, (error, redirectLocation, renderProps) => {
  // todo handle error somehow
  const component = (
    <Router
      {...renderProps}
      render={props => (
        <ReduxAsyncConnect
          {...props}
          helpers={{ client }}
          filter={item => !item.deferred}
          render={applyRouterMiddleware(scrollRouterMiddleware)}
        />
      )}
      onUpdate={trackPage}
      history={syncedHistory}
    >
      {routes}
    </Router>
  );

  if (module.hot) {
    module.hot.accept(() => {
      ReactDOM.hydrate(
        <AppContainer>
          <I18nextProvider i18n={i18nClient}>
            <Provider store={store} key="provider">
              {component}
            </Provider>
          </I18nextProvider>
        </AppContainer>,
        dest
      );
    });
  }

  ReactDOM.hydrate(
    <AppContainer>
      <I18nextProvider i18n={i18nClient}>
        <Provider store={store} key="provider">
          {component}
        </Provider>
      </I18nextProvider>
    </AppContainer>,
    dest
  );

  if (__DEVTOOLS__ && !window.devToolsExtension) {
    const DevTools = require('containers/DevTools/DevTools');
    ReactDOM.hydrate(
      <I18nextProvider i18n={i18nClient}>
        <Provider store={store} key="provider">
          <div>
            {component}
            <DevTools />
          </div>
        </Provider>
      </I18nextProvider>,
      dest
    );
  }

  if (__DEVELOPMENT__) {
    console.timeEnd('deity client match');
  }

  // eslint-disable-next-line
  const isLocalhost = location.host.match(/(localhost|127.0.0.1)/);
  if (!__DEVELOPMENT__ && 'serviceWorker' in navigator && (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker
      .register('/dist/service-worker.js', { scope: '/' })
      .then(() => {
        Logger.debug('Service worker registered!');
      })
      .catch(err => {
        Logger.debug('Error registering service worker: ', err);
      });

    navigator.serviceWorker.ready.then((/* registration */) => {
      Logger.debug('Service Worker Ready');
    });

    window.addEventListener('beforeinstallprompt', event => {
      // time when add to homescreen dialog is shown can be changed
      // based on different requirements
      // more details https://developers.google.com/web/updates/2018/06/a2hs-updates
      event.prompt();
    });
  }
});
