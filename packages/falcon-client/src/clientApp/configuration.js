import configuration from '@clientSrc/configuration';

const { logLevel = 'error', serverSideRendering = true, usePwaManifest = true, googleTagManager = { id: null } } =
  configuration.config || {};

const configDefaults = {
  config: {
    __typename: 'config',
    logLevel,
    serverSideRendering,
    usePwaManifest,
    googleTagManager: {
      __typename: 'googleTagManager',
      ...googleTagManager
    }
  }
};

export default {
  config: configDefaults,

  onServerCreated: configuration.onServerCreated || (() => {}),
  onServerInitialized: configuration.onServerInitialized || (() => {}),
  onServerStarted: configuration.onServerStarted || (() => {})
};
