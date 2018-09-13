const ApiContainer = require('./ApiContainer');

const apis = [{ package: 'fake-backend-api', name: 'fake-api' }];

describe('ApiContainer', () => {
  it('Should register provided API DataSources', () => {
    /** @type {ApiContainer} */
    const container = new ApiContainer(apis);
    expect(container.dataSources.size).toBe(1);
    expect(container.endpoints).toHaveLength(1);

    const apiInstance = container.dataSources.get('fake-api');
    expect(apiInstance).toBeTruthy();
    expect(apiInstance.name).toBe('fake-api');

    const endpoint = container.endpoints[0];
    expect(endpoint.path).toBe('/api/info');
  });

  it('Should do nothing for an empty API list', () => {
    const container = new ApiContainer();
    expect(container.dataSources.size).toBe(0);
    expect(container.endpoints).toHaveLength(0);
  });

  it('Should not fail for missing API DataSource package', () => {
    const container = new ApiContainer([{ package: 'foo-bar' }]);

    expect(container.dataSources.size).toBe(0);
  });
});
