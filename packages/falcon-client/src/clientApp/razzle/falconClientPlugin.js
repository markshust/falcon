const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');
const paths = require('./paths');

function setEntryToFalconClient(config, target) {
  if (target === 'web') {
    const indexOfAppClientIndexJS = config.entry.client.findIndex(x => x === paths.razzle.appClientIndexJs);
    if (indexOfAppClientIndexJS < 0) {
      throw new Error(
        `can not find '${target}' entry '${
          paths.razzle.appClientIndexJs
        }', it is required to configure '@deity/falcon-client'`
      );
    }

    config.entry.client[indexOfAppClientIndexJS] = paths.falconClient.appClientIndexJs;
  }

  if (target === 'node') {
    const indexOfAppServerIndexJs = config.entry.findIndex(x => x === paths.razzle.appServerIndexJs);
    if (indexOfAppServerIndexJs < 0) {
      throw new Error(
        `can not find '${target}' entry '${
          paths.razzle.appServerIndexJs
        }', it is required to configure '@deity/falcon-client'`
      );
    }

    config.entry[indexOfAppServerIndexJs] = paths.falconClient.appServerIndexJs;
  }

  return config;
}

function makeFalconClientJsFileResolvedByWebpack(config) {
  const babelLoaderFinder = makeLoaderFinder('babel-loader');
  const babelLoader = config.module.rules.find(babelLoaderFinder);
  if (!babelLoader) {
    throw new Error(`'babel-loader' was erased from config, it is required to configure '@deity/falcon-client'`);
  }

  babelLoader.include.push(paths.falconClient.appSrc);

  return config;
}

function addPathResolutionAlias(config, name, value) {
  config.resolve.alias[name] = value;

  return config;
}

// eslint-disable-next-line no-unused-vars
module.exports = (config, { target, dev }, webpackObject) => {
  addPathResolutionAlias(config, '@src', paths.razzle.appSrc);
  addPathResolutionAlias(config, '@clientSrc', paths.razzle.appSrc);
  addPathResolutionAlias(config, '@hostSrc', paths.falconClient.appSrc);

  setEntryToFalconClient(config, target);
  makeFalconClientJsFileResolvedByWebpack(config);

  return config;
};
