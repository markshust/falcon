import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { ApolloProvider, renderToStringWithData } from 'react-apollo';
import ClientApp from '@hostSrc/clientApp';
import ApolloClient from '@hostSrc/service/ApolloClient';

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
