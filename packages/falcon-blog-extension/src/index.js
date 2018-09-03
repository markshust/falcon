const { makeExecutableSchema } = require('graphql-tools');
const requireGraphQLFile = require('require-graphql-file');
const Logger = require('@deity/falcon-logger');

const typeDefs = requireGraphQLFile('./schema');
const DEFAULT_FETCH_URL_PRIORITY = 10;

/**
 * Simple blog extension.
 *
 * Features:
 * - list posts
 * - show single post
 * - show shop products inside post
 *
 * Only wordpress is supported as backend at the moment.
 */
module.exports = class Blog {
  constructor(config) {
    this.config = config;
  }

  async init() {
    return this.initConfig();
  }

  getGraphQLConfig() {
    return {
      schema: makeExecutableSchema({ typeDefs }),
      resolvers: {
        Query: {
          post: async (root, { path }, { dataSources, session }) => {
            // todo this can break with category/post url hierarchy
            const slug = path.replace('/', '');

            return dataSources[this.config.api].getPost({ slug, language: session.language });
          },
          posts: (root, params, { dataSources, session }) =>
            dataSources[this.config.api].getPosts({ language: session.language })
        }
      }
    };
  }

  getFetchUrlPriority() {
    return this.api.getFetchUrlPriority() || DEFAULT_FETCH_URL_PRIORITY;
  }

  async fetchUrl(root, { path }, { dataSources, session = {} }) {
    const { language } = session;
    return dataSources[this.config.api].fetchUrl(path, language);
  }

  getApi() {
    return this.api;
  }

  async initConfig() {
    const data = await this.getApi().getInfo();

    const { languages = {} } = data;

    if (languages.options) {
      this.languages = languages.options;
    } else {
      Logger.warn('Seems that your wordpress has no languages defined.');
    }

    this.apiConfig = data;
  }

  isLanguageSupported(language) {
    return this.languages && this.languages.find(item => item.code === language);
  }
};
