import fetch from 'isomorphic-unfetch';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { ApolloProvider, renderToStringWithData } from 'react-apollo';
import ClientApp from '@hostSrc/clientApp';
import ApolloClient from '@hostSrc/service/ApolloClient';

// Polyfill fetch() on the server (used by apollo-client)
global.fetch = fetch;

/**
 * Server Side Rendering middleware.
 * @async
 * @param {string} ctx - Koa context, if ctx.state.prerenderedApp exists then prerendered app will be injected.
 * @param {string} next - Koa next.
 * @returns {Promise<void>} - next middleware or redirect
 */
export default async (ctx, next) => {
  const client = new ApolloClient();
  const context = {};

  const markup = (
    <ApolloProvider client={client}>
      <StaticRouter context={context} location={ctx.url}>
        {ClientApp.component}
      </StaticRouter>
    </ApolloProvider>
  );

  ctx.state.client = client;
  ctx.state.prerenderedApp = {
    markup: await renderToStringWithData(markup),
    state: client.extract()
  };

  return context.url ? ctx.redirect(context.url) : next();
};
