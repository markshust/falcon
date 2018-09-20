const WordpressApi = require('./');

describe('WordPress API', () => {
  it('Should', () => {
    const wpApi = new WordpressApi({
      config: {
        host: 'example.com',
        protocol: 'https'
      }
    });
    expect(wpApi.baseURL).toBe('https://example.com');
  });
});
