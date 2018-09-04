module.exports = class Extension {
  /**
   * @param {object} config Extension config object
   * @param {string} name Extension short-name
   */
  constructor({ config, name = null }) {
    this.name = name || this.constructor.name;
    this.config = config;
  }
};
