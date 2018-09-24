const path = require('path');
const paths = require('./../paths');
// eslint-disable-next-line import/no-extraneous-dependencies
const FalconI18nLocalesPlugin = require('@deity/falcon-i18n-webpack-plugin');
const razzlePluginTypescript = require('razzle-plugin-typescript');
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

function extendBabelInclude(includePaths = []) {
  return config => {
    const babelLoaderFinder = makeLoaderFinder('babel-loader');
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
  const tsLoaderFinder = makeLoaderFinder('ts-loader');
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
 * @param {object} config webpack config
 * @param {boolean} dev is dev?
 * @returns {void}
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
 * @returns {object} razzle plugin
 */
module.exports = appConfig => (config, { target, dev }, webpackObject) => {
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    public: path.join(paths.razzle.appPath, 'public'),
    src: paths.razzle.appSrc,

    'app-path': paths.razzle.appPath
  };

  setEntryToFalconClient(config, target);
  extendBabelInclude([paths.falconClient.appSrc, path.join(paths.resolvePackageDir('@deity/falcon-ui'), 'src')])(
    config
  );
  addTypeScript(config, { target, dev }, webpackObject);

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
  addFalconI18nPlugin(appConfig.i18n, config, dev);

  return config;
};
