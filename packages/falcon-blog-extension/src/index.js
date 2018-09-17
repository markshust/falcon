const { Extension } = require('@deity/falcon-server-env');
const Logger = require('@deity/falcon-logger');

const typeDefs = require('fs').readFileSync('src/schema.graphql', 'utf8');

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
          post: async (root, { path }, { session }) => {
            // todo this can break with category/post url hierarchy
            const slug = path.replace('/', '');

            return this.api.getPost({ slug, language: session.language });
          },
          posts: (root, params, { session }) => this.api.getPosts({ language: session.language })
        }
      }
    };
  }

  async fetchUrl(root, { path }, { session = {} }) {
    const { language } = session;
    return this.api.fetchUrl(path, language);
  }
};
