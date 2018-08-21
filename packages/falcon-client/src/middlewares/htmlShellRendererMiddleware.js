import React from 'react';
import { renderToString } from 'react-dom/server';
import gql from 'graphql-tag';
import Html from '@hostSrc/components/Html';

// eslint-disable-next-line
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

/**
 * HTML shell renderer middleware.
 * @param {string} ctx - Koa context, if ctx.state.prerenderedApp exists then prerendered app will be injected.
 * @param {string} next - Koa next.
 */
export default async ctx => {
  const { client, prerenderedApp, asyncContext } = ctx.state;
  const { data } = await client.query({
    query: gql`
      {
        config @client {
          usePwaManifest
          googleTagManager {
            id
          }
        }
      }
    `
  });

  const htmlDocument = renderToString(
    <Html
      assets={assets}
      asyncContext={asyncContext}
      state={client.extract()}
      content={prerenderedApp}
      config={data.config}
    />
  );

  ctx.status = 200;
  ctx.body = `<!doctype html>${htmlDocument}`;
};
