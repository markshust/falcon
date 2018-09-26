import { HTTPCache } from 'apollo-datasource-rest';
import { Request, Response } from 'apollo-server-env';
import { ContextType, ContextFetchOptions, ContextFetchResponse } from '../types';

export default class ContextHTTPCache extends HTTPCache {
  async fetch(request: Request, options: ContextFetchOptions = {}): Promise<ContextFetchResponse> {
    const { cacheOptions = {} } = options;
    const context: ContextType = typeof cacheOptions === 'object' ? (cacheOptions.context as ContextType) : {};
    const result: ContextFetchResponse = await super.fetch(request, options);
    result.context = context;

    return result;
  }
}
