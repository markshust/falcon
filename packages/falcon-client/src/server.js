import falconWebServer from './falcon-web-server';
import App, { clientApolloSchema } from './clientApp';
import configuration from './clientApp/configuration';

/**
 * Creates an instance of Falcon web server
 * @param {ServerAppConfig} props Application parameters
 * @return {WebServer} Falcon web server
 */
export default falconWebServer({
  App,
  clientApolloSchema,
  configuration
});
