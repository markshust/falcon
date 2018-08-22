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

  // First 'getDataFromTree' call - fetching data for static components
  await ctx.state.timings.profile(async () => getDataFromTree(markup), 'getDataFromTree() #1');

  // Mounting async components (defined by GraphQL response)
  await ctx.state.timings.profile(async () => asyncBootstrapper(markup), 'asyncBootstrapper() #1');

  // Second 'getDataFromTree' call - fetching data for newly mounted dynamic components (DynamicRoute)
  await ctx.state.timings.profile(async () => getDataFromTree(markup), 'getDataFromTree() #2');

  await ctx.state.timings.profile(() => {
    ctx.state.prerenderedApp = renderToString(markup);
  }, 'SSR renderToString()');

  ctx.state.asyncContext = asyncContext.getState();

  return context.url ? ctx.redirect(context.url) : next();
};
