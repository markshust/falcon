/**
 * HtmlManager converts HTML elements:
 * - strips html tags/entities,
 * - truncates text
 * WARNING: Avoid importing it on client side (it will increase bundle size by about 20kb)
 */
module.exports = class HtmlManager {
  constructor() {
    this.isValidNode = () => true;
    this.striptags = require('striptags');
    const { AllHtmlEntities } = require('html-entities');
    this.entities = new AllHtmlEntities();
  }

  /**
   * Strip HTML tags and HTML entities
   * @param {String} html element containing HTML tags and HTML entities
   * @returns {String} | HTML clean element
   */
  stripHtml(html) {
    if (html && typeof html === 'string') {
      return this.striptags(this.entities.decode(html));
    }
  }

  stripHtmlEntities(html) {
    if (html && typeof html === 'string') {
      return this.entities.decode(html);
    }
  }

  stripHtmlTags(html) {
    if (html && typeof html === 'string') {
      return this.striptags(html);
    }
  }

  generateExcerpt(text, length = 140) {
    if (!text) {
      return '';
    }

    const content = this.stripHtml(text);

    if (content && content.length > length) {
      return `${content.slice(0, length)}...`;
    }

    return content;
  }
};
