import fetch from 'isomorphic-unfetch';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import Koa from 'koa';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import Router from 'koa-router';
import { ApolloProvider, renderToStringWithData } from 'react-apollo';
import Logger from '@deity/falcon-logger';
import ClientApp from './clientApp';
import ApolloClient from './service/ApolloClient';
import Html from './components/Html';
import error500 from './middlewares/error500Middleware';

Logger.setLogLevel(ClientApp.config.logLevel);

// eslint-disable-next-line
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

// Polyfill fetch() on the server (used by apollo-client)
global.fetch = fetch;

// Initialize `koa-router` and setup a route listening on `GET /*`
// Logic has been splitted into two chained middleware functions
// @see https://github.com/alexmingoia/koa-router#multiple-middleware
const router = new Router();
router.get(
  '/*',
  async (ctx, next) => {
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
    ctx.state.markup = await renderToStringWithData(markup);

    return context.url ? ctx.redirect(context.url) : next();
  },
  ctx => {
    const { markup, client } = ctx.state;
    const { serverSideRendering, usePwaManifest, gtmCode } = ClientApp.config;

    const htmlDocument = renderToString(
      serverSideRendering ? (
        <Html
          assets={assets}
          store={client.extract()}
          content={markup}
          usePwaManifest={usePwaManifest}
          gtmCode={gtmCode}
        />
      ) : (
        <Html assets={assets} usePwaManifest={usePwaManifest} gtmCode={gtmCode} />
      )
    );

    ctx.status = 200;
    ctx.body = `<!doctype html>${htmlDocument}`;
  }
);

// Intialize and configure Koa application
const server = new Koa();
ClientApp.onServerCreated(server);

server
  .use(error500)
  // `koa-helmet` provides security headers to help prevent common, well known attacks
  // @see https://helmetjs.github.io/
  .use(helmet())
  .use(serve(process.env.RAZZLE_PUBLIC_DIR))
  .use(router.routes())
  .use(router.allowedMethods());

ClientApp.onServerInitialized(server);

export default server;
