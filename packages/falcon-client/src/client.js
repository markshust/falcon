import { ApolloProvider } from 'react-apollo';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { hydrate } from 'react-dom';
import App from '@clientSrc/App';
import ApolloClient from './service/ApolloClient';

const client = new ApolloClient({
  isBrowser: true,
  // eslint-disable-next-line no-underscore-dangle
  initialState: window.__APOLLO_STATE__ || {}
});

const markup = (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
);

const rootHtmlElement = document.getElementById('root');

// TODO load configuration from apollo client
// const { serverSideRendering } = ClientApp.config;
// if (serverSideRendering) {
hydrate(markup, rootHtmlElement);
// } else {
//   render(markup, rootHtmlElement);
// }

if (module.hot) {
  module.hot.accept();
}
