import ApiDataSource from './ApiDataSource';
import nock = require('nock');
import { ContextRequestOptions } from '../types';

class CustomApiDataSource extends ApiDataSource {
  async getInfo(): Promise<object> {
    return this.get<object>('/api/info', {}, {
      context: {
        isAuthRequired: true,
        bar: 1
      }
    });
  }

  async postInfo(): Promise<object> {
    return this.post<object>('/api/info');
  }

  async putInfo(): Promise<object> {
    return this.put<object>('/api/info');
  }

  async deleteInfo(): Promise<object> {
    return this.delete<object>('/api/info');
  }

  async patchInfo(): Promise<object> {
    return this.patch<object>('/api/info');
  }

  async authorizeRequest(req: ContextRequestOptions): Promise<void> {
    await super.authorizeRequest(req);
    req.headers.set('foo', 'bar');
  }
}

describe('ApiDataSource', () => {

  afterAll(() => {
    nock.restore();
  });

  it('Should create an instance of ApiDataSource', async () => {
    let customApiDataSource: CustomApiDataSource = new CustomApiDataSource({
      config: {}
    });
    expect(customApiDataSource.name).toBe('CustomApiDataSource');
    expect(customApiDataSource.baseURL).toBeUndefined();

    customApiDataSource = new CustomApiDataSource({
      config: {
        protocol: 'https',
        host: 'example.com',
        fetchUrlPriority: 10
      }
    });
    expect(customApiDataSource.baseURL).toBe('https://example.com');
    expect(customApiDataSource.fetchUrlPriority).toBe(10);
  });

  it('Should pass the provided "context"', async () => {
    const basePath: string = '/api/info';
    const fakeApi: nock.Scope = nock('http://example.com')
      .get(basePath).reply(200, { foo: true })
      .post(basePath).reply(200, { foo: true })
      .put(basePath).reply(200, { foo: true })
      .delete(basePath).reply(200, { foo: true })
      .patch(basePath).reply(200, { foo: true })
      .persist(true);

    const customApi: CustomApiDataSource = new CustomApiDataSource({
      config: { host: 'example.com' }
    });
    const willSendRequestSpy: jest.SpyInstance = jest.spyOn(customApi, 'willSendRequest');
    const didReceiveResponseSpy: jest.SpyInstance = jest.spyOn(customApi, 'didReceiveResponse');

    await customApi.initialize({context: {}});

    for (const method of [
      async () => customApi.getInfo(),
      async () => customApi.postInfo(),
      async () => customApi.putInfo(),
      async () => customApi.deleteInfo(),
      async () => customApi.patchInfo()
    ]) {
      const result: any = await method();
      expect(result).toEqual({foo: true});
      expect(willSendRequestSpy).toHaveBeenCalled();
      expect(didReceiveResponseSpy).toHaveBeenCalled();

      willSendRequestSpy.mockClear();
      didReceiveResponseSpy.mockClear();
    }

    await customApi.getInfo();

    expect(willSendRequestSpy.mock.calls[0][0].context).toEqual({ bar: 1, isAuthRequired: true });
    expect(didReceiveResponseSpy.mock.calls[0][0].context).toEqual({ bar: 1, isAuthRequired: true });
    const requestObject = didReceiveResponseSpy.mock.calls[0][1];
    const requestHeadersSymbol = Object.getOwnPropertySymbols(requestObject)[1];
    expect(requestObject[requestHeadersSymbol].headers.get('foo')).toBe('bar');

    willSendRequestSpy.mockRestore();
    didReceiveResponseSpy.mockRestore();
  });
});
