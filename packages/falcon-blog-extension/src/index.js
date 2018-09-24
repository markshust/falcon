const { Extension } = require('@deity/falcon-server-env');
const Logger = require('@deity/falcon-logger');
const { resolve } = require('path');
const typeDefs = require('fs').readFileSync(resolve(__dirname, 'schema.graphql'), 'utf8');

/**
 * Simple blog extension.
 *
 * Features:
 * - list posts
 * - show single post
 * - show shop products inside post
 */
module.exports = class Blog extends Extension {
  async initialize() {
    await super.initialize();
    const { languages = {} } = this.apiConfig;

    if (languages.options) {
      this.languages = languages.options;
    } else {
      Logger.warn(`Seems that "${this.api.name}" API DataSource has no languages defined.`);
    }

    return this.apiConfig;
  }

  isLanguageSupported(language) {
    return this.languages && this.languages.find(item => item.code === language);
  }

  async getGraphQLConfig() {
    return {
      schema: [typeDefs],
      dataSources: {
        [this.api.name]: this.api
      },
      resolvers: {
        Query: {
          blogPost: async (...params) => this.api.blogPost(...params),
          blogPosts: async (...params) => this.api.blogPosts(...params)
        }
      }
    };
  }

  async fetchUrl(root, { path }, { session = {} }) {
    const { language } = session;
    return this.api.fetchUrl(path, language);
  }

  getFetchUrlPriority() {
    return this.fetchUrlPriority;
  }
};
