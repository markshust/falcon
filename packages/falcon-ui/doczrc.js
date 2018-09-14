// eslint-disable-next-line
import doczPluginNetlify from 'docz-plugin-netlify';

module.exports = {
  typescript: true,
  propsParser: false,
  src: './',
  wrapper: 'docs/Wrapper',
  title: 'Falcon UI',
  themeConfig: {
    colors: {
      background: '#fafafa'
    },
    styles: {
      playground: {
        background: '#fff'
      }
    }
  },
  modifyBundlerConfig: config =>
    // const jsxPluginIndex = config.plugins.findIndex(plugin => plugin.config.id === 'jsx');
    // const { loaders } = config.plugins[jsxPluginIndex].config;
    // const docGenLoaderIndex = loaders.findIndex(loader => /react-docgen-typescript-loader/.test(loader.loader));
    // const docGenLoader = loaders[docGenLoaderIndex];

    // docGenLoader.options = {
    //   tsconfigPath: './tsconfig.json'
    // };

    config,
  plugins: [doczPluginNetlify()]
};
