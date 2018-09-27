import { DataSourceConfig } from 'apollo-datasource';
import { RESTDataSource } from 'apollo-datasource-rest';
import { Body, Request } from 'apollo-datasource-rest/dist/RESTDataSource';
import { URL, URLSearchParams, URLSearchParamsInit } from 'apollo-server-env';
import { stringify } from 'qs';
import { format } from 'url';
import ContextHTTPCache from '../cache/ContextHTTPCache';
import {
  ApiDataSourceConfig,
  ApiDataSourceEndpoint,
  ConfigurableConstructorParams,
  ContextCacheOptions,
  ContextFetchResponse,
  ContextFetchRequest,
  ContextRequestInit,
  ContextRequestOptions,
  PaginationData
} from '../types';

export type PaginationValue = number | string | null;

export default abstract class ApiDataSource<TContext = any> extends RESTDataSource<TContext> {
  public name: string;
  public config: ApiDataSourceConfig;
  public fetchUrlPriority: number = 1;
  public perPage: number = 10;

  /**
   * @param {ApiDataSourceConfig} config API DataSource config
   * @param {string} name API DataSource short-name
   */
  constructor({ config, name }: ConfigurableConstructorParams<ApiDataSourceConfig> = {}) {
    super();
    this.name = name || this.constructor.name;
    this.config = config || {};

    const { host, port, protocol } = this.config;
    if (host) {
      this.baseURL = format({
        protocol: protocol === 'https' || Number(port) === 443 ? 'https' : 'http',
        hostname: host,
        port: Number(port) || undefined
      });
    }

    const { fetchUrlPriority, perPage } = this.config;

    this.fetchUrlPriority = fetchUrlPriority || this.fetchUrlPriority;
    this.perPage = perPage || this.perPage;
  }

  /**
   * This method should be used for "pre-initializing" API DataSource instance,
   * for example - for fetching API backend configuration required for Server start up
   * @return {Promise<TResult|null>} Result object
   */
  async preInitialize<TResult = any>(): Promise<TResult | null> {
    return null;
  }

  initialize(config: DataSourceConfig<TContext>): void {
    super.initialize(config);
    this.httpCache = new ContextHTTPCache(config.cache);
  }

  /**
   * Should be implemented if ApiDataSource wants to deliver content via dynamic URLs.
   * It should return priority value for passed url.
   * @param url - url for which the priority should be returned
   * @return {number} Priority index
   */
  getFetchUrlPriority?(url: string): number;

  /**
   * Returns a list of REST endpoints to be handled by this module
   * @return {ApiDataSourceEndpoint[]} List of API routes (endpoints)
   */
  getEndpoints(): ApiDataSourceEndpoint[] {
    return [];
  }

  protected async willSendRequest(request: ContextRequestOptions): Promise<void> {
    const { context } = request;
    if (context && context.isAuthRequired && this.authorizeRequest) {
      await this.authorizeRequest(request);
    }
  }

  async authorizeRequest?(req: ContextRequestOptions): Promise<void>;

  /**
   * Calculates "pagination" data
   * @param {PaginationValue} totalItems Total amount of entries
   * @param {PaginationValue} [currentPage=null] Current page index
   * @param {PaginationValue} [perPage=null] Limit entries per page
   * @return {PaginationData} Calculated result
   */
  protected processPagination(
    totalItems: PaginationValue,
    currentPage: PaginationValue = null,
    perPage: PaginationValue = null
  ): PaginationData {
    /* eslint-disable no-underscore-dangle */
    const _totalItems: number = parseInt(totalItems as string, 10) || 0;
    const _perPage: number = parseInt(perPage as string, 10) || this.perPage;
    const _currentPage: number = parseInt(currentPage as string, 10) || 1;
    const _totalPages: number | null = _perPage ? Math.ceil(_totalItems / _perPage) : null;
    /* eslint-enable no-underscore-dangle */

    return {
      totalItems: _totalItems,
      totalPages: _totalPages,
      currentPage: _currentPage,
      perPage: _perPage,
      nextPage: _totalPages && _currentPage < _totalPages ? _currentPage + 1 : null,
      prevPage: _currentPage > 1 ? _currentPage - 1 : null
    };
  }

  protected async get<TResult = any>(
    path: string,
    params?: URLSearchParamsInit,
    init: ContextRequestInit = {}
  ): Promise<TResult> {
    this.ensureContextPassed(init);
    return super.get<TResult>(path, this.preprocessParams(params), init);
  }

  protected async post<TResult = any>(path: string, body?: Body, init: ContextRequestInit = {}): Promise<TResult> {
    this.ensureContextPassed(init);
    return super.post<TResult>(path, body, init);
  }

  protected async patch<TResult = any>(path: string, body?: Body, init: ContextRequestInit = {}): Promise<TResult> {
    this.ensureContextPassed(init);
    return super.patch<TResult>(path, body, init);
  }

  protected async put<TResult = any>(path: string, body?: Body, init: ContextRequestInit = {}): Promise<TResult> {
    this.ensureContextPassed(init);
    return super.put<TResult>(path, body, init);
  }

  protected async delete<TResult = any>(
    path: string,
    params?: URLSearchParamsInit,
    init: ContextRequestInit = {}
  ): Promise<TResult> {
    this.ensureContextPassed(init);
    return super.delete<TResult>(path, this.preprocessParams(params), init);
  }

  protected async didReceiveResponse<TResult = any>(res: ContextFetchResponse, req: Request): Promise<TResult> {
    const result: TResult = await super.didReceiveResponse<TResult>(res, req);
    const { context } = res;

    if (context && context.didReceiveResult) {
      return context.didReceiveResult(result, res);
    }
    return result;
  }

  protected cacheKeyFor(request: Request): string {
    const cacheKey: string = super.cacheKeyFor(request);
    // Note: temporary disabling "memoized" map due to issues with GraphQL resolvers,
    // GET-requests in particular ("fetchUrl" query)
    this.memoizedResults.delete(cacheKey);
    return cacheKey;
  }

  private ensureContextPassed(init?: ContextRequestInit): void {
    init = init || {};

    if (!init.context) {
      init.context = {};
    }
    if (!init.cacheOptions) {
      init.cacheOptions = {};
    }
    if (typeof init.cacheOptions === 'object') {
      (init.cacheOptions as ContextCacheOptions).context = init.context;
    }
  }

  private preprocessParams(params?: URLSearchParamsInit): URLSearchParamsInit {
    // if params is plain object then convert it to URLSearchParam with help of qs.stringify - that way
    // we can be sure that nested object will be converted correctly to search params
    const searchString: string = stringify(params, {
      encodeValuesOnly: true
    });

    return new URLSearchParams(searchString);
  }
}
