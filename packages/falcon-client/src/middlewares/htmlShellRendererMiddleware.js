import React from 'react';
import { renderToString } from 'react-dom/server';
import configuration from '@hostSrc/clientApp/configuration';
import Html from '@hostSrc/components/Html';

// eslint-disable-next-line
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

/**
 * HTML shell renderer middleware.
 * @param {string} ctx - Koa context, if ctx.state.prerenderedApp exists then prerendered app will be injected.
 * @param {string} next - Koa next.
 */
export default ctx => {
  const { prerenderedApp, asyncContext, client } = ctx.state;
  const { usePwaManifest, gtmCode } = configuration.config;

  const htmlDocument = renderToString(
    <Html
      assets={assets}
      asyncContext={asyncContext}
      state={client.extract()}
      content={prerenderedApp}
      usePwaManifest={usePwaManifest}
      gtmCode={gtmCode}
    />
  );

  ctx.status = 200;
  ctx.body = `<!doctype html>${htmlDocument}`;
};
