const path = require('path');
const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');
const paths = require('./../paths');

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

function addVendorBundle(config, { target, dev }) {
  if (target === 'web') {
    // modify filenaming to account for multiple entry files
    config.output.filename = dev ? 'static/js/[name].js' : 'static/js/[name].[hash:8].js';

    config.entry.vendor = [
      'apollo-cache-inmemory',
      'apollo-client',
      'apollo-link',
      'apollo-link-http',
      'apollo-link-state',
      'i18next',
      //  we need to Razzle's polyfills because
      // vendor.js will be loaded before our other entry. Razzle looks for
      // process.env.REACT_BUNDLE_PATH and will exclude the polyfill from our normal entry
      'razzle/polyfills',
      'react',
      'react-apollo',
      'react-dom',
      'react-google-tag-manager',
      'react-i18next',
      'react-router-dom'
    ].map(x => require.resolve(x));

    config.optimization = {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'initial',
            test: 'vendor', // test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            enforce: true
            // chunks: 'all'
          }
        }
      }
    };
  }
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

// eslint-disable-next-line no-unused-vars
module.exports = (config, { target, dev }, webpackObject) => {
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    public: path.join(paths.razzle.appPath, 'public'),
    src: paths.razzle.appSrc,
    'app-path': paths.razzle.appPath
  };

  setEntryToFalconClient(config, target);
  makeFalconClientJsFileResolvedByWebpack(config);
  addVendorBundle(config, { target, dev });
  addGraphQLTagLoader(config);

  return config;
};
