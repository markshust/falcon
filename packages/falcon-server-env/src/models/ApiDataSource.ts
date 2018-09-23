import { DataSourceConfig } from 'apollo-datasource';
import { RESTDataSource } from 'apollo-datasource-rest';
import { Body, Request } from 'apollo-datasource-rest/dist/RESTDataSource';
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
import { URLSearchParamsInit } from 'apollo-server-env';
import { format } from 'url';

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
  async preInitialize<TResult = any>(): Promise<TResult|null> {
    return null;
  }

  initialize(config: DataSourceConfig<TContext>): void {
    super.initialize(config);
    this.httpCache = new ContextHTTPCache(config.cache);
  }

  /**
   * Returns a list of REST endpoints to be handled by this module
   * @return {ApiDataSourceEndpoint[]} List of API routes (endpoints)
   */
  getEndpoints(): ApiDataSourceEndpoint[] {
    return [];
  }

  async willSendRequest(req: ContextRequestOptions): Promise<void> {
    // console.log({ req });

    const { context } = req;
    if (context && context.isAuthRequired) {
      await this.authorizeRequest(req);
    }
  }

  async authorizeRequest(req: ContextRequestOptions): Promise<void> {}

  /**
   * Calculates "pagination" data
   * @param {PaginationValue} totalItems
   * @param {PaginationValue} [currentPage=null]
   * @param {PaginationValue} [perPage=null]
   * @return {PaginationData} Calculated result
   */
  processPagination(
    totalItems: PaginationValue,
    currentPage: PaginationValue = null,
    perPage: PaginationValue = null
  ): PaginationData {
    const _totalItems: number = parseInt(totalItems as string, 10) || 0;
    const _perPage: number = parseInt(perPage as string, 10) || this.perPage;
    const _currentPage: number = parseInt(currentPage as string, 10) || 1;
    const _totalPages: number | null = _perPage ? Math.ceil(_totalItems / _perPage) : null;

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
    return super.get<TResult>(path, params, init);
  }

  protected async post<TResult = any>(
    path: string,
    body?: Body,
    init: ContextRequestInit = {}
  ): Promise<TResult> {
    this.ensureContextPassed(init);
    return super.post<TResult>(path, body, init);
  }

  protected async patch<TResult = any>(
    path: string,
    body?: Body,
    init: ContextRequestInit = {}
  ): Promise<TResult> {
    this.ensureContextPassed(init);
    return super.patch<TResult>(path, body, init);
  }

  protected async put<TResult = any>(
    path: string,
    body?: Body,
    init: ContextRequestInit = {}
  ): Promise<TResult> {
    this.ensureContextPassed(init);
    return super.put<TResult>(path, body, init);
  }

  protected async delete<TResult = any>(
    path: string,
    params?: URLSearchParamsInit,
    init: ContextRequestInit = {}
  ): Promise<TResult> {
    this.ensureContextPassed(init);
    return super.delete<TResult>(path, params, init);
  }

  protected async didReceiveResponse<TResult = any>(
    res: ContextFetchResponse,
    req: Request,
  ): Promise<TResult> {
    const result: TResult = await super.didReceiveResponse<TResult>(res, req);
    const { context } = res;

    if (context && context.didReceiveResult) {
      await context.didReceiveResult(result);
    }
    return result;
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
}