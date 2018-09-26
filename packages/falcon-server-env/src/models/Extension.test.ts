// eslint-disable-next-line import/no-extraneous-dependencies
import 'jest-extended';
import { GraphQLResolveInfo } from 'graphql';
import Extension from './Extension';
import ApiDataSource from './ApiDataSource';
import { FetchUrlResult } from '../types';

class CustomExtension extends Extension {
  getFetchUrlPriority(url: string): number {
    return 0;
  }

  async fetchUrl(obj: object, args: any, context: any, info: GraphQLResolveInfo): Promise<FetchUrlResult> {
    return Promise.resolve({ id: 1, type: 'post', path: 'foo' });
  }
}

class CustomApiDataSource extends ApiDataSource {}

describe('Extension', () => {
  let ext: CustomExtension;

  beforeEach(() => {
    ext = new CustomExtension({
      config: {},
      extensionContainer: {}
    });
  });

  it('Should create an instance of Extension', async () => {
    expect(ext.config).toEqual({});
    expect(ext.name).toBe('CustomExtension');
  });

  it('Should not throw an error while initializing when there is no API DataSource assigned', async () => {
    expect(async () => {
      await ext.initialize();
    }).not.toThrow();
  });

  it('Should initialize correctly (with the assigned API DataSource instance)', async () => {
    const api: CustomApiDataSource = new CustomApiDataSource({});
    const preInitializeSpy: jest.SpyInstance = jest.spyOn(api, 'preInitialize');
    ext.api = api;

    expect(async () => {
      await ext.initialize();
    }).not.toThrow();

    preInitializeSpy.mockRestore();
  });
});
