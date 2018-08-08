import { ApolloProvider } from 'react-apollo';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { hydrate } from 'react-dom';
import App from './App';
import ApolloClient from './service/ApolloClient';

/* eslint-disable-next-line no-underscore-dangle */
const client = new ApolloClient(true, window.__APOLLO_STATE__);

hydrate(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
