import { Response, Request } from 'apollo-server-env';
import { CacheOptions } from 'apollo-datasource-rest/dist/RESTDataSource';
import { IMiddleware } from 'koa-router';

export interface ConfigurableConstructorParams {
  config: object;
  name?: string;
}

export type ContextType = {
  [propName: string]: any;
};

export interface ContextData {
  context?: ContextType;
}

export type ContextCacheOptions = CacheOptions & ContextData;

export type ContextFetchOptions = {
  cacheKey?: string;
  cacheOptions?:
    | ContextCacheOptions
    | ((response: Response, request: Request) => ContextCacheOptions | undefined)
};

export type ContextFetchResponse = Response & ContextData;

export interface ApiDataSourceEndpoint {
  path: string;
  methods: string[];
  handler: IMiddleware
}
