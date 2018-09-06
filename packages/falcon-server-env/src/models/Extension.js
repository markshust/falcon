module.exports = class Extension {
  /**
   * @param {object} config Extension config object
   * @param {string} name Extension short-name
   */
  constructor({ config, name = null }) {
    this.name = name || this.constructor.name;
    this.config = config;

    /** @type {ApiDataSource|null} */
    this.api = null;
  }

  async initialize() {
    if (!this.api) {
      throw new Error(`"${this.name}" extension: API DataSource was not defined`);
    }

    await this.api.preInitialize();
  }

  /**
   * GraphQL configuration getter
   * @return {object} GraphQL configuration object
   */
  async getGraphQLConfig() {
    return {};
  }
};
