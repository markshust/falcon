import falconWebServer from './falcon-web-server';
import App, { clientApolloSchema } from './clientApp';
import configuration from './clientApp/configuration';

// eslint-disable-next-line
const assetsManifest = require(process.env.RAZZLE_ASSETS_MANIFEST);

/**
 * Creates an instance of Falcon web server
 * @param {ServerAppConfig} props Application parameters
 * @return {WebServer} Falcon web server
 */
export default falconWebServer({
  App,
  clientApolloSchema,
  configuration,
  webpackAssets: {
    clientJs: assetsManifest.client.js,
    clientCss: assetsManifest.client.css,
    vendorsJs: assetsManifest.vendors.js,
    webmanifest: assetsManifest[''].webmanifest
  }
});
