import ClientApp from '@clientSrc';

export default {
  config: {
    // host: undefined,
    // port: undefined,
    serverSideRendering: true,
    logLevel: 'error',
    usePwaManifest: true,
    gaCode: undefined,
    gtmCode: undefined,

    ...ClientApp.config
  },
  clientState: app.clientState || {},

  onServerCreated: ClientApp.onServerCreated || (() => {}),
  onServerInitialized: ClientApp.onServerInitialized || (() => {}),
  onServerStarted: ClientApp.onServerStarted || (() => {})
};
