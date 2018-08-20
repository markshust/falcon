import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import App from '@hostSrc/clientApp';
import { AsyncComponentProvider, createAsyncContext } from 'react-async-component';
import asyncBootstrapper from 'react-async-bootstrapper';

/**
 * Server Side Rendering middleware.
 * @async
 * @param {string} ctx - Koa context, if ctx.state.prerenderedApp exists then prerendered app will be injected.
 * @param {string} next - Koa next.
 * @returns {Promise<void>} - next middleware or redirect
 */
export default async (ctx, next) => {
  const { client } = ctx.state;
  const context = {};
  const asyncContext = createAsyncContext();

  const markup = (
    <ApolloProvider client={client}>
      <AsyncComponentProvider asyncContext={asyncContext}>
        <StaticRouter context={context} location={ctx.url}>
          <App />
        </StaticRouter>
      </AsyncComponentProvider>
    </ApolloProvider>
  );

  await getDataFromTree(markup);
  await asyncBootstrapper(markup);

  ctx.state.prerenderedApp = renderToString(markup);
  ctx.state.asyncContext = asyncContext.getState();

  return context.url ? ctx.redirect(context.url) : next();
};
