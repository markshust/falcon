import { ApolloProvider } from 'react-apollo';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { hydrate } from 'react-dom';
import ClientApp from '@clientApp';
import ApolloClient from './service/ApolloClient';

/* eslint-disable-next-line no-underscore-dangle */
const client = new ApolloClient(true, window.__APOLLO_STATE__);

const markup = (
  <ApolloProvider client={client}>
    <BrowserRouter>{ClientApp.component}</BrowserRouter>
  </ApolloProvider>
);

hydrate(markup, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
