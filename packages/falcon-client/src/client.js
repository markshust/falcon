import 'app-path/src/manifest.webmanifest';
import React from 'react';
import { hydrate, render } from 'react-dom';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import { ApolloProvider } from 'react-apollo';
import { AsyncComponentProvider } from 'react-async-component';
import asyncBootstrapper from 'react-async-bootstrapper';
import { I18nextProvider } from 'react-i18next';
import ApolloClient from './service/ApolloClient';
import App, { clientApolloSchema } from './clientApp';
import { CLIENT_SIDE_APP_INIT } from './graphql/config.gql';
import i18nFactory from './i18n/i18nClientFactory';
import registerServiceWorker from './serviceWorker/register';

const i18nextState = window.I18NEXT_STATE || {};
const client = new ApolloClient({
  isBrowser: true,
  clientState: clientApolloSchema,
  // eslint-disable-next-line no-underscore-dangle
  initialState: window.__APOLLO_STATE__ || {}
});
const { config } = client.readQuery({ query: CLIENT_SIDE_APP_INIT });
const renderApp = config.serverSideRendering ? hydrate : render;

const markup = (
  <ApolloProvider client={client}>
    <AsyncComponentProvider rehydrateState={window.ASYNC_COMPONENTS_STATE}>
      <I18nextProvider
        i18n={i18nFactory(config.i18n)}
        initialLanguage={i18nextState.language}
        initialI18nStore={i18nextState.data}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nextProvider>
    </AsyncComponentProvider>
  </ApolloProvider>
);

asyncBootstrapper(markup).then(() => renderApp(markup, document.getElementById('root')));

if (process.env.NODE_ENV === 'production') {
  registerServiceWorker('/sw.js');
}

if (module.hot) {
  module.hot.accept();
}
