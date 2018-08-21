const path = require('path');
const fs = require('fs');
const Logger = require('@deity/falcon-logger');
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

// eslint-disable-next-line no-unused-vars
module.exports = (config, { target, dev }, webpackObject) => {
  if (fs.existsSync(path.join(paths.razzle.appSrc, `index.js`)) === false) {
    Logger.logAndThrow(`There is no 'index.js' file in '${paths.razzle.appSrc}' directory!`);
  }
  if (fs.existsSync(path.join(paths.razzle.appSrc, `configuration.js`)) === false) {
    Logger.logAndThrow(`There is no 'configuration.js' file in '${paths.razzle.appSrc}' directory!`);
  }

  config.resolve.alias['@src'] = paths.razzle.appSrc;
  config.resolve.alias['@clientSrc'] = paths.razzle.appSrc;
  config.resolve.alias['@hostSrc'] = paths.falconClient.appSrc;

  setEntryToFalconClient(config, target);
  makeFalconClientJsFileResolvedByWebpack(config);

  return config;
};
