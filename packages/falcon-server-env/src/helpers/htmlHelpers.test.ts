import helpers from './htmlHelpers';

describe('Helpers', () => {
  it('Should "stripHtml"', () => {
    expect(helpers.stripHtml('<p>Foo</p>')).toBe('Foo');
    expect(helpers.stripHtml('')).toBe('');
  });

  it('Should "stripHtmlEntities"', () => {
    expect(helpers.stripHtmlEntities('&lt;')).toBe('<');
    expect(helpers.stripHtmlEntities('')).toBe('');
  });

  it('Should "stripHtmlTags"', () => {
    expect(helpers.stripHtmlTags('<p>Foo</p>')).toBe('Foo');
    expect(helpers.stripHtmlTags('')).toBe('');
  });

  it('Should "generateExcerpt"', () => {
    expect(helpers.generateExcerpt('<p>Foo text</p>', 3)).toBe('Foo...');
    expect(helpers.generateExcerpt('')).toBe('');
    expect(helpers.generateExcerpt('<span></span>')).toBe('');
  });
});
