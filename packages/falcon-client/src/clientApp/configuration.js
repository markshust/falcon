import configuration from '@clientSrc/configuration';

export default {
  config: {
    // host: undefined,
    // port: undefined,
    serverSideRendering: true,
    logLevel: 'error',
    usePwaManifest: true,
    gaCode: '',
    gtmCode: '',

    ...configuration.config
  },

  onServerCreated: configuration.onServerCreated || (() => {}),
  onServerInitialized: configuration.onServerInitialized || (() => {}),
  onServerStarted: configuration.onServerStarted || (() => {})
};
