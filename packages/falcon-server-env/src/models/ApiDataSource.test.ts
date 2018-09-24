/* eslint-disable no-restricted-syntax, no-await-in-loop, import/no-extraneous-dependencies */
import 'jest-extended';
import ApiDataSource from './ApiDataSource';
import { ContextRequestOptions, ContextFetchRequest, ContextFetchResponse } from '../types';

import nock = require('nock');

class CustomApiDataSource extends ApiDataSource {
  async getInfo(): Promise<object> {
    return this.get<object>(
      '/api/info',
      {},
      {
        context: {
          isAuthRequired: true,
          bar: 1
        }
      }
    );
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

  it('Should process "pagination" data', () => {
    const customApiDataSource: CustomApiDataSource = new CustomApiDataSource({
      config: {
        perPage: 5
      }
    });
    expect(customApiDataSource.processPagination(100)).toEqual({
      currentPage: 1,
      nextPage: 2,
      perPage: 5,
      prevPage: null,
      totalItems: 100,
      totalPages: 20
    });
    expect(customApiDataSource.processPagination(20, 3, 2)).toEqual({
      currentPage: 3,
      nextPage: 4,
      perPage: 2,
      prevPage: 2,
      totalItems: 20,
      totalPages: 10
    });
    expect(customApiDataSource.processPagination(0)).toEqual({
      currentPage: 1,
      nextPage: null,
      perPage: 5,
      prevPage: null,
      totalItems: 0,
      totalPages: 0
    });
  });

  describe('Context', () => {
    const basePath: string = '/api/info';

    beforeAll(() => {
      nock('http://example.com')
        .get(uri => uri.indexOf(basePath) >= 0)
        .reply(200, { foo: true })
        .post(basePath)
        .reply(200, { foo: true })
        .put(basePath)
        .reply(200, { foo: true })
        .delete(basePath)
        .reply(200, { foo: true })
        .patch(basePath)
        .reply(200, { foo: true })
        .persist(true);
    });

    afterAll(() => {
      nock.restore();
    });

    it('Should pass the provided "context" per request', async () => {
      const customApi: CustomApiDataSource = new CustomApiDataSource({
        config: { host: 'example.com' }
      });
      const willSendRequestSpy: jest.SpyInstance = jest.spyOn(customApi, 'willSendRequest');
      const didReceiveResponseSpy: jest.SpyInstance = jest.spyOn(customApi, 'didReceiveResponse');

      await customApi.initialize({
        context: {}
      } as any);

      for (const method of [
        async () => customApi.getInfo(),
        async () => customApi.postInfo(),
        async () => customApi.putInfo(),
        async () => customApi.deleteInfo(),
        async () => customApi.patchInfo()
      ]) {
        const result: any = await method();
        expect(result).toEqual({ foo: true });
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

    it('Should handle response data via context.didReceiveResult', async () => {
      const CustomClass = class extends ApiDataSource {
        async getCustomEntry<TResult = object>(): Promise<TResult> {
          return this.get<TResult>(
            '/api/info',
            {},
            {
              context: {
                didReceiveResult: async (result: TResult) =>
                  // Performing data transformation...
                  ({
                    bar: true
                  })
              }
            }
          );
        }
      };
      const customApi = new CustomClass({
        config: { host: 'example.com' }
      });
      await customApi.initialize({
        context: {}
      } as any);

      const result: any = await customApi.getCustomEntry();
      expect(result).toEqual({ bar: true });
    });

    it('Should ensure "context" object is passed', async () => {
      const CustomClass = class extends ApiDataSource {
        async getCustomEntry<TResult = object>(): Promise<TResult> {
          return this.get<TResult>('/api/info');
        }
      };
      const customApi = new CustomClass({
        config: { host: 'example.com' }
      });
      const willSendRequestSpy: jest.SpyInstance = jest.spyOn(customApi, 'willSendRequest');
      const didReceiveResponseSpy: jest.SpyInstance = jest.spyOn(customApi, 'didReceiveResponse');

      await customApi.initialize({
        context: {}
      } as any);

      const result: any = await customApi.getCustomEntry();
      expect(result).toEqual({ foo: true });
      expect(willSendRequestSpy.mock.calls[0][0].context).toEqual({});
      expect(willSendRequestSpy.mock.calls[0][0].cacheOptions.context).toEqual({});
      expect(didReceiveResponseSpy.mock.calls[0][0].context).toEqual({});

      willSendRequestSpy.mockRestore();
      didReceiveResponseSpy.mockRestore();
    });

    it('Should handle multi-level "params" URL object', async () => {
      const CustomApi = class extends ApiDataSource {
        async getEntry<TResult = object>(): Promise<TResult> {
          return this.get<TResult>('/api/info', {
            str: 'str',
            foo: {
              bar: true,
              nested: {
                foo: 1
              }
            },
            arr: [1, 2]
          });
        }
      };
      const customApi = new CustomApi({
        config: {
          protocol: 'http',
          host: 'example.com',
          fetchUrlPriority: 10
        }
      });

      const resolveURLSpy: jest.SpyInstance = jest.spyOn(customApi, 'resolveURL');
      const didReceiveResponseSpy: jest.SpyInstance = jest.spyOn(customApi, 'didReceiveResponse');

      customApi.initialize({ context: {} });
      await customApi.getEntry();

      expect(resolveURLSpy.mock.calls[0][0].path).toBe('/api/info');
      expect(Array.from(resolveURLSpy.mock.calls[0][0].params.entries())).toEqual([
        ['str', 'str'],
        ['foo[bar]', 'true'],
        ['foo[nested][foo]', '1'],
        ['arr[]', '1'],
        ['arr[]', '2']
      ]);
      expect(didReceiveResponseSpy.mock.calls[0][1].url).toEqual(
        expect.stringContaining('?str=str&foo%5Bbar%5D=true&foo%5Bnested%5D%5Bfoo%5D=1&arr%5B%5D=1&arr%5B%5D=2')
      );
    });
  });
});
