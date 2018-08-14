import React from 'react';
import app from '@clientApp';

if (!React.isValidElement(app.component)) {
  const clientAppIndexJs = require.resolve('@clientApp');
  throw new Error(`File ${clientAppIndexJs} does not export valid React component!
   Make sure that you export React component e.g. 'export const component = <App />'`);
}

export default {
  component: app.component,
  config: {
    host: undefined,
    port: undefined,
    usePWAManifest: undefined,
    gtmCode: undefined,

    ...app.config
  },

  onServerCreated: app.onServerCreated || (() => {}),
  onServerInitialized: app.onServerInitialized || (() => {}),
  onServerStarted: app.onServerStarted || (() => {})
};
