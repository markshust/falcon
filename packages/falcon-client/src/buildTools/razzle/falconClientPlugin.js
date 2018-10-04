/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const FalconI18nLocalesPlugin = require('@deity/falcon-i18n-webpack-plugin');
const razzlePluginTypescript = require('razzle-plugin-typescript');
const WebpackConfigHelpers = require('razzle-dev-utils/WebpackConfigHelpers');
const AssetsPlugin = require('assets-webpack-plugin');
const NodeExternals = require('webpack-node-externals');
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

function excludeIcoFromFileLoader(config) {
  const fileLoaderFinder = webpackConfigHelper.makeLoaderFinder('file-loader');
  const fileLoader = config.module.rules.find(fileLoaderFinder);
  fileLoader.exclude.push(/\.(ico)$/);
}

function fixUrlLoaderFallback(config, target) {
  const urlLoaderFinder = webpackConfigHelper.makeLoaderFinder('url-loader');
  const urlLoader = config.module.rules.find(urlLoaderFinder);
  urlLoader.options.fallback = require.resolve('file-loader');

  urlLoader.options.limit = -1; // always fallback to file-loader
  urlLoader.options.emitFile = target === 'web';
  urlLoader.test.push(/\.(ico)$/);
}

function extendBabelInclude(includePaths = []) {
  return config => {
    const babelLoaderFinder = webpackConfigHelper.makeLoaderFinder('babel-loader');
    const babelLoader = config.module.rules.find(babelLoaderFinder);
    if (!babelLoader) {
      throw new Error(`'babel-loader' was erased from config, it is required to configure '@deity/falcon-client'`);
    }

    babelLoader.include = [...babelLoader.include, ...includePaths];
  };
}

function addTypeScript(config, { target, dev }, webpackObject) {
  razzlePluginTypescript(config, { target, dev }, webpackObject, {
    useBabel: true,
    useEslint: true,
    forkTsChecker: {
      tslint: false
    }
  });

  // use latest ts-Loader
  const tsLoaderFinder = webpackConfigHelper.makeLoaderFinder('ts-loader');
  const tsRule = config.module.rules.find(tsLoaderFinder);
  if (!tsRule) {
    throw new Error(`'ts-loader' was erased from config, it is required to configure '@deity/falcon-client'`);
  }

  const indexOfTsLoader = tsRule.use.findIndex(tsLoaderFinder);
  tsRule.use[indexOfTsLoader].loader = require.resolve('ts-loader');
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

function addWebManifest(config, target) {
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
}

function addToNodeExternals(whitelist) {
  return (config, { target, dev }) => {
    if (target === 'node') {
      config.externals = [
        NodeExternals({
          whitelist: [
            dev ? 'webpack/hot/poll?300' : null,
            /\.(eot|woff|woff2|ttf|otf)$/,
            /\.(svg|png|jpg|jpeg|gif|ico)$/,
            /\.(mp4|mp3|ogg|swf|webp)$/,
            /\.(css|scss|sass|sss|less)$/,
            ...whitelist
          ].filter(x => x)
        })
      ];
    }
  };
}

/**
 * falcon-client and razzle integration plugin
 * @param {{i18n: i18nPluginConfig }} appConfig webpack config
 * @returns {object} razzle plugin
 */
module.exports = appConfig => (config, { target, dev }, webpackObject) => {
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    src: paths.razzle.appSrc,
    'app-path': paths.razzle.appPath
  };

  setEntryToFalconClient(config, target);
  // make sure that webpack handle @deity/falcon-client from shop directory
  extendBabelInclude([paths.falconClient.appSrc, /\/@deity\/falcon-client\//])(config);
  addToNodeExternals([/\/@deity\/falcon-client\//])(config, { target, dev });

  addTypeScript(config, { target, dev }, webpackObject);
  fixUrlLoaderFallback(config, target);
  fixAssetsWebpackPlugin(config, target);
  addVendorsBundle([
    'apollo-cache-inmemory',
    'apollo-client',
    'apollo-link',
    'apollo-link-http',
    'apollo-link-state',
    'apollo-utilities',
    'graphql',
    'graphql-tag',
    'node-fetch',
    'i18next',
    'i18next-xhr-backend',
    'razzle/polyfills',
    'razzle',
    'react',
    'react-apollo',
    'react-async-bootstrapper2',
    'react-async-component',
    'react-dom',
    'react-google-tag-manager',
    `react-helmet`,
    'react-i18next',
    'react-router',
    'react-router-dom',
    'history'
  ])(config, { target, dev });
  excludeIcoFromFileLoader(config);
  addGraphQLTagLoader(config);
  addFalconI18nPlugin(appConfig.i18n)(config, target);
  addWebManifest(config, target);

  if (target === 'web' && process.env.NODE_ANALYZE) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }
  return config;
};
