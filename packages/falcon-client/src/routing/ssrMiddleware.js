import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import Helmet from 'react-helmet';
import { I18nextProvider } from 'react-i18next';
import { AsyncComponentProvider, createAsyncContext } from 'react-async-component';
import asyncBootstrapper from 'react-async-bootstrapper';
import { filterResourceStoreByNs } from '../i18n/i18nServerFactory';

/**
 * Server Side Rendering middleware.
 * @param {{App: React.Component}} App - React Component to render
 * @return {function(ctx: object, next: function): Promise<void>} Koa middleware
 */
export default ({ App }) => async (ctx, next) => {
  const { client, serverTiming } = ctx.state;
  const { i18next } = ctx;
  const context = {};
  const asyncContext = createAsyncContext();
  const i18nextUsedNamespaces = new Set();

  const markup = (
    <ApolloProvider client={client}>
      <AsyncComponentProvider asyncContext={asyncContext}>
        <I18nextProvider
          i18n={i18next}
          reportNS={ns => {
            i18nextUsedNamespaces.add(ns || i18next.options.defaultNS);
          }}
        >
          <StaticRouter context={context} location={ctx.url}>
            <App />
          </StaticRouter>
        </I18nextProvider>
      </AsyncComponentProvider>
    </ApolloProvider>
  );

  // First 'getDataFromTree' call - fetching data for static components
  await serverTiming.profile(async () => getDataFromTree(markup), 'getDataFromTree() #1');

  // Mounting async components (defined by GraphQL response)
  await serverTiming.profile(async () => asyncBootstrapper(markup), 'asyncBootstrapper() #1');

  // Second 'getDataFromTree' call - fetching data for newly mounted dynamic components (DynamicRoute)
  await serverTiming.profile(async () => getDataFromTree(markup), 'getDataFromTree() #2');

  await serverTiming.profile(() => {
    renderToString(markup);
  }, 'SSR renderToString()');

  ctx.state.App = markup;
  ctx.state.asyncContext = asyncContext.getState();
  ctx.state.helmetContext = Helmet.renderStatic();
  ctx.state.i18nextFilteredStore = filterResourceStoreByNs(i18next.services.resourceStore.data, i18nextUsedNamespaces);

  return context.url ? ctx.redirect(context.url) : next();
};
