import React from 'react';
import { hydrate, render } from 'react-dom';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import { ApolloProvider } from 'react-apollo';
import { AsyncComponentProvider } from 'react-async-component';
import asyncBootstrapper from 'react-async-bootstrapper';
import { I18nextProvider } from 'react-i18next';
import ApolloClient from './service/ApolloClient';
import App, { clientApolloSchema } from './clientApp';
import { SSR } from './graphql/config.gql';
import i18next from './i18n/i18nextClient';

const client = new ApolloClient({
  isBrowser: true,
  clientState: clientApolloSchema,
  // eslint-disable-next-line no-underscore-dangle
  initialState: window.__APOLLO_STATE__ || {}
});

const { config } = client.readQuery({ query: SSR });

const renderApp = config.serverSideRendering ? hydrate : render;

const markup = (
  <ApolloProvider client={client}>
    <I18nextProvider i18n={i18next()}>
      <AsyncComponentProvider rehydrateState={window.ASYNC_COMPONENTS_STATE}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AsyncComponentProvider>
    </I18nextProvider>
  </ApolloProvider>
);

asyncBootstrapper(markup).then(() => renderApp(markup, document.getElementById('root')));

if (module.hot) {
  module.hot.accept();
}
