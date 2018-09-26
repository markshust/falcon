import deepMerge from 'deepmerge';
import configuration from 'app-path/falcon-client.config.js';

const config = deepMerge(
  {
    __typename: 'Config',
    logLevel: 'error',
    serverSideRendering: true,
    useWebManifest: true,
    googleTagManager: {
      __typename: 'GoogleTagManager',
      id: null
    },
    i18n: {
      __typename: 'I18n',
      lng: 'en',
      ns: ['common'],
      fallbackLng: 'en',
      whitelist: ['en'],
      // available: languages taken from falcon-server
      debug: false
    }
  },
  configuration.config,
  { arrayMerge: (destination, source) => source }
);

export default {
  config,
  configSchema: {
    defaults: {
      config
    }
  },

  onServerCreated: configuration.onServerCreated || (() => {}),
  onServerInitialized: configuration.onServerInitialized || (() => {}),
  onServerStarted: configuration.onServerStarted || (() => {})
};
