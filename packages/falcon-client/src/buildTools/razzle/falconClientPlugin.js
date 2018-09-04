const path = require('path');
const paths = require('./../paths');
// eslint-disable-next-line import/no-extraneous-dependencies
const FalconI18nLocalesPlugin = require('@deity/falcon-i18n-webpack-plugin');
const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');

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
}

function makeFalconClientJsFileResolvedByWebpack(config) {
  const babelLoaderFinder = makeLoaderFinder('babel-loader');
  const babelLoader = config.module.rules.find(babelLoaderFinder);
  if (!babelLoader) {
    throw new Error(`'babel-loader' was erased from config, it is required to configure '@deity/falcon-client'`);
  }

  babelLoader.include.push(paths.falconClient.appSrc);
}

function addGraphQLTagLoader(config) {
  const fileLoaderFinder = makeLoaderFinder('file-loader');
  const fileLoader = config.module.rules.find(fileLoaderFinder);
  if (fileLoader) {
    fileLoader.exclude.push(/\.(graphql|gql)$/);
  }

  config.module.rules.push({
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    include: [paths.falconClient.appSrc],
    use: require.resolve('graphql-tag/loader')
  });
  config.resolve.extensions.push('.graphql', '.gql');
}

/**
 * @typedef {object} i18nPluginConfig
 * @property {string[]} resourcePackages npm modules with localization resources
 * @property {object{ lng, ns }} filter Initial configuration
 */

/**
 * Adds FalconI18nPlugin into webpack configuration
 * @param {i18nPluginConfig} param configuration
 * @param {{}} config webpack config
 * @param {{}} dev is dev?
 */
function addFalconI18nPlugin({ resourcePackages = [], filter }, config, dev) {
  config.plugins = [
    ...config.plugins,
    new FalconI18nLocalesPlugin({
      mainSource: path.join(paths.razzle.appPath, 'i18n'),
      defaultSources: resourcePackages.map(x => paths.resolvePackageDir(x)).map(x => path.join(x, 'i18n')),
      output: dev ? 'public/i18n' : 'build/public/i18n',
      filter
    })
  ];
}

/**
 * falcon-client and razzle integration plugin
 * @param {{i18n: i18nPluginConfig }} appConfig webpack config
 * @returns {{}} razzle plugin
 */
module.exports = appConfig => (config, { target, dev } /* ,  webpackObject */) => {
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    public: path.join(paths.razzle.appPath, 'public'),
    src: paths.razzle.appSrc,

    'app-path': paths.razzle.appPath
  };

  setEntryToFalconClient(config, target);
  makeFalconClientJsFileResolvedByWebpack(config);
  addGraphQLTagLoader(config);
  addFalconI18nPlugin(appConfig.i18n, config, dev);

  return config;
};
