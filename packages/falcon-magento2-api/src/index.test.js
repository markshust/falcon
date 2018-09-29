global.__SERVER__ = true; // eslint-disable-line no-underscore-dangle

const nock = require('nock');
const Magento2Api = require('./index');
const magentoResponses = require('./__mocks__/apiResponses');

const URL = 'http://example.com';
const apiConfig = {
  config: {
    host: 'example.com',
    protocol: 'http'
  },
  name: 'api-magento2'
};

function createMagentoUrl(path) {
  return `/rest/default/V1${path}`;
}

describe('Magento2Api', () => {
  let api;

  beforeAll(async () => {
    nock(URL)
      .post(createMagentoUrl('/integration/admin/token'))
      .reply(200, magentoResponses.adminToken.data);
    api = new Magento2Api(apiConfig);
    await api.preInitialize();
  });

  afterAll(() => {
    nock.restore();
  });

  it('should correctly fetch admin token', async () => {
    const result = await api.retrieveAdminToken();
    expect(result).toEqual(magentoResponses.adminToken.data.token);
  });

  it('should correctly fetch category data', async () => {
    nock(URL)
      .get(uri => /\/categories\/20/.test(uri)) // regexp as query params might be there
      .reply(200, magentoResponses.category.data);

    api.context = { magento: { storeCode: '' } };
    const result = await api.category({ id: 20 });
    expect(result.data.id).toEqual(magentoResponses.category.data.id);
  });

  // todo: detailed tests for category data parsing, so all the cases are covered
});
