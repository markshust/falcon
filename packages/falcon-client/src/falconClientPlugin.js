const path = require('path');
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

function makeFalconClientJsFilesResolvedByWebpack(config) {
  const babelLoaderFinder = makeLoaderFinder('babel-loader');
  const babelLoader = config.module.rules.find(babelLoaderFinder);
  if (!babelLoader) {
    throw new Error(`'babel-loader' was erased from config, it is required to configure '@deity/falcon-client'`);
  }

  const falconClientDir = path.dirname(require.resolve('@deity/falcon-client/package.json'));
  babelLoader.include.push(path.join(falconClientDir, 'src'));

  return config;
}

function addAliasToClientAppSrc(config) {
  config.resolve.alias['@clientApp'] = paths.razzle.appSrc;

  return config;
}

// eslint-disable-next-line no-unused-vars
module.exports = (config, { target, dev }, webpackObject) => {
  config = addAliasToClientAppSrc(config);
  config = setEntryToFalconClient(config, target);
  config = makeFalconClientJsFilesResolvedByWebpack(config);

  return config;
};
