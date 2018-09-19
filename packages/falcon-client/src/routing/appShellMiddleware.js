import React from 'react';
import { renderToString } from 'react-dom/server';
import { extractI18nextState } from '../i18n/i18nServerFactory';
import Html from '../components/Html';

/**
 * Application shell renderer middleware.
 * @return {function(ctx: object, next: function): Promise<void>} Koa middleware
 */
export default () => async ctx => {
  const { App, client, asyncContext, helmetContext, serverTiming, webpackAssets } = ctx.state;
  const renderTimer = serverTiming.start('HTML renderToString()');

  const htmlDocument = renderToString(
    <Html
      assets={webpackAssets}
      asyncContext={asyncContext}
      helmetContext={helmetContext}
      state={client.extract()}
      i18nextState={extractI18nextState(ctx)}
    >
      {App}
    </Html>
  );

  serverTiming.stop(renderTimer);

  ctx.status = 200;
  ctx.body = `<!doctype html>${htmlDocument}`;
};
