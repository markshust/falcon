import fetch from 'isomorphic-unfetch';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import Koa from 'koa';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import Router from 'koa-router';
import { ApolloProvider, renderToStringWithData } from 'react-apollo';
import App from './App';
import ApolloClient from './apollo';

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
    const AppComponent = (
      <ApolloProvider client={client}>
        <StaticRouter location={ctx.url} context={context}>
          <App />
        </StaticRouter>
      </ApolloProvider>
    );

    ctx.state.client = client;
    ctx.state.markup = await renderToStringWithData(AppComponent);
    return context.url ? ctx.redirect(context.url) : next();
  },
  ctx => {
    ctx.status = 200;
    ctx.body = `
    <!doctype html>
      <html lang="">
      <head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta charset="utf-8" />
          <title>Welcome to Razzle + Koa</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
          ${
            process.env.NODE_ENV === 'production'
              ? `<script src="${assets.client.js}" defer></script>`
              : `<script src="${assets.client.js}" defer crossorigin></script>`
          }
      </head>
      <body>
          <div id="root">${ctx.state.markup}</div>
          <script>window.__APOLLO_STATE__ = ${JSON.stringify(ctx.state.client.extract()).replace(
            /</g,
            '\\u003c'
          )};</script>
      </body>
    </html>`;
  }
);

// Intialize and configure Koa application
const server = new Koa();
server
  // `koa-helmet` provides security headers to help prevent common, well known attacks
  // @see https://helmetjs.github.io/
  .use(helmet())
  // Serve static files located under `process.env.RAZZLE_PUBLIC_DIR`
  .use(serve(process.env.RAZZLE_PUBLIC_DIR))
  .use(router.routes())
  .use(router.allowedMethods());

export default server;
