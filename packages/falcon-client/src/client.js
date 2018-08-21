import React from 'react';
import { hydrate, render } from 'react-dom';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import { ApolloProvider } from 'react-apollo';
import { AsyncComponentProvider } from 'react-async-component';
import asyncBootstrapper from 'react-async-bootstrapper';
import gql from 'graphql-tag';
import ApolloClient from '@hostSrc/service/ApolloClient';
import App, { clientState } from '@hostSrc/clientApp';

const client = new ApolloClient({
  isBrowser: true,
  clientState,
  // eslint-disable-next-line no-underscore-dangle
  initialState: window.__APOLLO_STATE__ || {}
});

client
  .query({
    query: gql`
      {
        config @client {
          serverSideRendering
        }
      }
    `
  })
  .then(({ data: { config } }) => {
    const renderApp = config.serverSideRendering ? hydrate : render;

    const markup = (
      <ApolloProvider client={client}>
        <AsyncComponentProvider rehydrateState={window.ASYNC_COMPONENTS_STATE}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AsyncComponentProvider>
      </ApolloProvider>
    );

    return asyncBootstrapper(markup).then(() => renderApp(markup, document.getElementById('root')));
  });

if (module.hot) {
  module.hot.accept();
}
