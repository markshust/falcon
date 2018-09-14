import ApiDataSource from './ApiDataSource';
import ContextHTTPCache from './ContextHTTPCache';
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

  async authorizeRequest(req: ContextRequestOptions): Promise<void> {
    await super.authorizeRequest(req);
    req.headers.set('foo', 'bar');
  }
}

describe('ApiDataSource', () => {
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
    const fakeApi: nock.Scope = nock('http://example.com')
      .get('/api/info')
      .reply(200, { foo: true });

    const customApi: CustomApiDataSource = new CustomApiDataSource({
      config: { host: 'example.com' }
    });
    const willSendRequestSpy: jest.SpyInstance = jest.spyOn(customApi, 'willSendRequest');
    const didReceiveResponseSpy: jest.SpyInstance = jest.spyOn(customApi, 'didReceiveResponse');

    await customApi.initialize({context: {}});

    const result: any = await customApi.getInfo();
    expect(result).toEqual({foo: true});
    expect(willSendRequestSpy).toHaveBeenCalled();
    expect(willSendRequestSpy.mock.calls[0][0].context).toEqual({ bar: 1, isAuthRequired: true });
    expect(didReceiveResponseSpy).toHaveBeenCalled();
    expect(didReceiveResponseSpy.mock.calls[0][0].context).toEqual({ bar: 1, isAuthRequired: true });

    const requestObject = didReceiveResponseSpy.mock.calls[0][1];
    const requestHeadersSymbol = Object.getOwnPropertySymbols(requestObject)[1];
    expect(requestObject[requestHeadersSymbol].headers.get('foo')).toBe('bar');

    willSendRequestSpy.mockRestore();
    didReceiveResponseSpy.mockRestore();
  });
});
