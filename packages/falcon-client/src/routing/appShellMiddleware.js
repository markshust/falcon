import React from 'react';
import { renderToString } from 'react-dom/server';
import { extractI18nextState } from '../i18n/i18nServerFactory';
import Html from '../components/Html';
import { APP_INIT } from '../graphql/config.gql';

/**
 * Application shell renderer middleware.
 * @return {function(ctx: object, next: function): Promise<void>} Koa middleware
 */
export default () => {
  // eslint-disable-next-line
  let assetsManifest = process.env.RAZZLE_ASSETS_MANIFEST && require(process.env.RAZZLE_ASSETS_MANIFEST);

  const assets = {
    clientJs: assetsManifest.client.js,
    clientCss: assetsManifest.client.css,
    vendorsJs: assetsManifest.vendors.js,
    webmanifest: assetsManifest[''] && assetsManifest[''].webmanifest
  };

  return async ctx => {
    const { client, App, asyncContext, serverTiming } = ctx.state;
    const { config } = client.readQuery({ query: APP_INIT });

    const renderTimer = serverTiming.start('HTML renderToString()');

    const htmlDocument = renderToString(
      <Html
        assets={assets}
        asyncContext={asyncContext}
        state={client.extract()}
        i18nextState={extractI18nextState(ctx)}
        config={config}
      >
        {App}
      </Html>
    );

    serverTiming.stop(renderTimer);

    ctx.status = 200;
    ctx.body = `<!doctype html>${htmlDocument}`;
  };
};
