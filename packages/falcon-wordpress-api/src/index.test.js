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
        type: 'post',
        url: '/foo/',
        data: {
          id: 1
        }
      });

    await wpApi.initialize({ context: {} });

    const result = await wpApi.fetchUrl('/foo/');
    expect(result).toEqual({
      id: 1,
      path: '/foo/',
      type: 'blog-post',
      redirect: false
    });
  });
});
