// eslint-disable-next-line
import doczPluginNetlify from 'docz-plugin-netlify';

module.exports = {
  typescript: true,
  propsParser: false,
  src: './src',
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
  plugins: [doczPluginNetlify()]
};
