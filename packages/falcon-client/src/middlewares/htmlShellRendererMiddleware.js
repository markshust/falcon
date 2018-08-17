import React from 'react';
import { renderToString } from 'react-dom/server';
import ClientApp from '@hostSrc/clientApp';
import Html from '@hostSrc/components/Html';

// eslint-disable-next-line
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

/**
 * HTML shell renderer middleware.
 * @param {string} ctx - Koa context, if ctx.state.prerenderedApp exists then prerendered app will be injected.
 * @param {string} next - Koa next.
 */
export default ctx => {
  const { prerenderedApp } = ctx.state;
  const { usePwaManifest, gtmCode } = ClientApp.config;

  const htmlDocument = renderToString(
    prerenderedApp ? (
      <Html
        assets={assets}
        state={prerenderedApp.state}
        content={prerenderedApp.markup}
        usePwaManifest={usePwaManifest}
        gtmCode={gtmCode}
      />
    ) : (
      <Html assets={assets} usePwaManifest={usePwaManifest} gtmCode={gtmCode} />
    )
  );

  ctx.status = 200;
  ctx.body = `<!doctype html>${htmlDocument}`;
};
