/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const FalconI18nLocalesPlugin = require('@deity/falcon-i18n-webpack-plugin');
const WebpackConfigHelpers = require('razzle-dev-utils/WebpackConfigHelpers');
const AssetsPlugin = require('assets-webpack-plugin');
const paths = require('./../paths');

const webpackConfigHelper = new WebpackConfigHelpers(paths.razzle.appPath);
function getPluginIndexByName(config, name) {
  return webpackConfigHelper
    .getPlugins(config)
    .findIndex(x => x.plugin && x.plugin.constructor && x.plugin.constructor.name === name);
}

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

function fixUrlLoaderFallback(config) {
  const urlLoaderFinder = webpackConfigHelper.makeLoaderFinder('url-loader');
  const urlLoader = config.module.rules.find(urlLoaderFinder);

  urlLoader.options.fallback = require.resolve('file-loader');
}

function makeFalconClientJsFileResolvedByWebpack(config) {
  const babelLoaderFinder = webpackConfigHelper.makeLoaderFinder('babel-loader');
  const babelLoader = config.module.rules.find(babelLoaderFinder);
  if (!babelLoader) {
    throw new Error(`'babel-loader' was erased from config, it is required to configure '@deity/falcon-client'`);
  }

  babelLoader.include.push(paths.falconClient.appSrc);
}

function addVendorsBundle(modules = []) {
  const moduleFilter = new RegExp(
    `[\\\\/]node_modules[\\\\/](${modules.map(x => x.replace('/', '[\\\\/]')).join('|')})[\\\\/]`
  );

  return (config, { target, dev }) => {
    if (target === 'web') {
      config.output.filename = dev ? 'static/js/[name].js' : 'static/js/[name].[hash:8].js';

      config.optimization = {
        splitChunks: {
          cacheGroups: {
            vendor: {
              name: 'vendors',
              enforce: true,
              chunks: 'initial',
              test: moduleFilter
            }
          }
        }
      };
    }
  };
}

function addGraphQLTagLoader(config) {
  const fileLoaderFinder = webpackConfigHelper.makeLoaderFinder('file-loader');
  const mediaFilesRule = config.module.rules.find(fileLoaderFinder);
  if (mediaFilesRule) {
    mediaFilesRule.exclude.push(/\.(graphql|gql)$/);
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
 * @param {object} config webpack config
 * @param {boolean} dev is dev?
 * @returns {void}
 */
function addFalconI18nPlugin({ resourcePackages = [], filter }) {
  return (config, target) => {
    if (target === 'web') {
      config.plugins.unshift(
        new FalconI18nLocalesPlugin({
          mainSource: path.join(paths.razzle.appPath, 'i18n'),
          defaultSources: resourcePackages.map(x => paths.resolvePackageDir(x)).map(x => path.join(x, 'i18n')),
          output: 'build/i18n',
          filter
        })
      );
    }
  };
}

/**
 * fixing issue https://github.com/ztoben/assets-webpack-plugin/issues/41
 * @param {object} config webpack config
 * @param {'web'|'node'} target webpack config
 */
function fixAssetsWebpackPlugin(config, target) {
  if (target === 'web') {
    const indexOfAssetsWebpackPlugin = getPluginIndexByName(config, 'AssetsWebpackPlugin');
    config.plugins[indexOfAssetsWebpackPlugin] = new AssetsPlugin({
      path: paths.razzle.appBuild,
      filename: 'assets.json',
      includeAllFileTypes: true,
      prettyPrint: true
    });
  }
}

function addWebManifest() {
  return (config, target) => {
    if (target === 'web') {
      const fileLoaderFinder = webpackConfigHelper.makeLoaderFinder('file-loader');
      const mediaFilesRule = config.module.rules.find(fileLoaderFinder);
      if (mediaFilesRule) {
        mediaFilesRule.exclude.push(/\.(webmanifest|browserconfig)$/);
      }

      config.module.rules.push({
        test: /(manifest\.webmanifest|browserconfig\.xml)$/,
        use: [
          {
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/[name].[hash:8].[ext]',
              emitFile: true
            }
          },
          { loader: require.resolve('app-manifest-loader') }
        ]
      });
    }
  };
}
/**
 * falcon-client and razzle integration plugin
 * @param {{i18n: i18nPluginConfig }} appConfig webpack config
 * @returns {object} razzle plugin
 */
// eslint-disable-next-line no-unused-vars
module.exports = appConfig => (config, { target, dev } /* ,  webpackObject */) => {
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    src: paths.razzle.appSrc,
    'app-path': paths.razzle.appPath
  };

  setEntryToFalconClient(config, target);
  makeFalconClientJsFileResolvedByWebpack(config);

  fixUrlLoaderFallback(config);
  fixAssetsWebpackPlugin(config, target);

  addVendorsBundle([
    'apollo-cache-inmemory',
    'apollo-client',
    'apollo-link',
    'apollo-link-http',
    'apollo-link-state',
    `graphql-tag`,
    `node-fetch`,
    'i18next',
    'razzle/polyfills',
    'react',
    'react-apollo',
    'react-async-bootstrapper',
    'react-async-component',
    'react-dom',
    'react-google-tag-manager',
    `react-helmet`,
    'react-i18next',
    'react-router-dom'
  ])(config, { target, dev });

  addGraphQLTagLoader(config);
  addFalconI18nPlugin(appConfig.i18n)(config, target);
  addWebManifest()(config, target);

  return config;
};
