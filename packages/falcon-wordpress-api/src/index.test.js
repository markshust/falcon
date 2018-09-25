const WordpressApi = require('./');
const nock = require('nock');

describe('WordPress API', () => {
  let wpApi;

  beforeEach(() => {
    wpApi = new WordpressApi({
      config: {
        host: 'example.com',
        protocol: 'https'
      }
    });
  });

  afterAll(() => {
    nock.restore();
  });

  it('Should generate "baseURL" properly', () => {
    expect(wpApi.baseURL).toBe('https://example.com');
  });

  it('Should handle "fetchUrl" method response', async () => {
    nock('https://example.com')
      .get(uri => uri.indexOf('url?path'))
      .reply(200, {
        data: {
          type: 'post',
          url: '/foo/'
        },
        meta: { languagePrefix: null }
      });

    await wpApi.initialize({ context: {} });

    const result = await wpApi.fetchUrl('/foo/');
    expect(result).toEqual({
      url: '/foo/',
      type: 'blog-post',
      redirect: false
    });
  });
});
