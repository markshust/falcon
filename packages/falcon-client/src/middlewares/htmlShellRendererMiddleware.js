import React from 'react';
import { renderToString } from 'react-dom/server';
import Html from '@hostSrc/components/Html';
import { APP_INIT } from '@hostSrc/graphql/config.gql';

// eslint-disable-next-line
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

/**
 * HTML shell renderer middleware.
 * @param {string} ctx - Koa context, if ctx.state.prerenderedApp exists then prerendered app will be injected.
 * @param {string} next - Koa next.
 */
export default async ctx => {
  const { client, prerenderedApp, asyncContext, serverTiming } = ctx.state;
  const { config } = client.readQuery({ query: APP_INIT });

  const renderTimer = serverTiming.startTimer('HTML renderToString()');
  const htmlDocument = renderToString(
    <Html
      assets={assets}
      asyncContext={asyncContext}
      state={client.extract()}
      content={prerenderedApp}
      config={config}
    />
  );
  serverTiming.stopTimer(renderTimer);

  ctx.status = 200;
  ctx.body = `<!doctype html>${htmlDocument}`;
};
