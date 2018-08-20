import app from '@clientSrc';

export default {
  config: {
    // host: undefined,
    // port: undefined,
    serverSideRendering: true,
    logLevel: 'error',
    usePwaManifest: true,
    gaCode: undefined,
    gtmCode: undefined,

    ...app.config
  },
  clientState: app.clientState || {},

  onServerCreated: app.onServerCreated || (() => {}),
  onServerInitialized: app.onServerInitialized || (() => {}),
  onServerStarted: app.onServerStarted || (() => {})
};
