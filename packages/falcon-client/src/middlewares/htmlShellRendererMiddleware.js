import React from 'react';
import { renderToString } from 'react-dom/server';
import Html from '../components/Html';
import { APP_INIT } from '../graphql/config.gql';

// eslint-disable-next-line
const assets = (process.env.RAZZLE_ASSETS_MANIFEST && require(process.env.RAZZLE_ASSETS_MANIFEST)) || {
  client: {
    js: ''
  }
};

/**
 * HTML shell renderer middleware.
 * @param {string} ctx - Koa context, if ctx.state.prerenderedApp exists then prerendered app will be injected.
 * @param {string} next - Koa next.
 */
export default async ctx => {
  const { i18next } = ctx;
  const { client, prerenderedApp, asyncContext, i18nextFilteredStore, serverTiming } = ctx.state;
  const { config } = client.readQuery({ query: APP_INIT });

  const renderTimer = serverTiming.start('HTML renderToString()');
  const htmlDocument = renderToString(
    <Html
      assets={assets}
      asyncContext={asyncContext}
      state={client.extract()}
      i18nextState={{
        language: i18next.language,
        data: i18nextFilteredStore
      }}
      content={prerenderedApp}
      config={config}
    />
  );
  serverTiming.stop(renderTimer);

  ctx.status = 200;
  ctx.body = `<!doctype html>${htmlDocument}`;
};
