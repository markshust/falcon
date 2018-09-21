import { DataSourceConfig } from 'apollo-datasource';
import { RESTDataSource } from 'apollo-datasource-rest';
import { Body } from 'apollo-datasource-rest/dist/RESTDataSource';
import ContextHTTPCache from '../cache/ContextHTTPCache';
import { stringify } from 'qs';
import {
  ApiDataSourceConfig,
  ApiDataSourceEndpoint,
  ConfigurableConstructorParams,
  ContextCacheOptions,
  ContextRequestInit,
  ContextRequestOptions
} from '../types';
import { URLSearchParamsInit } from 'apollo-server-env';
import htmlHelpers, { ApiHelpers } from '../helpers/htmlHelpers';
import { format, URLSearchParams } from 'url';

export default abstract class ApiDataSource<TContext = any, THelpers = any> extends RESTDataSource<TContext> {
  public name: string;
  public config: ApiDataSourceConfig;
  public fetchUrlPriority: number = 1;
  public helpers: THelpers | ApiHelpers = htmlHelpers;

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

    if (this.config.fetchUrlPriority) {
      this.fetchUrlPriority = this.config.fetchUrlPriority;
    }
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
    const { context } = req;
    if (context && context.isAuthRequired) {
      await this.authorizeRequest(req);
    }
  }

  async authorizeRequest(req: ContextRequestOptions): Promise<void> {}

  protected async get<TResult = any>(
    path: string,
    params?: URLSearchParamsInit,
    init?: ContextRequestInit
  ): Promise<TResult> {
    this.ensureContextPassed(init);
    return super.get<TResult>(path, this.convertParams(params as URLSearchParamsInit), init);
  }

  protected async post<TResult = any>(
    path: string,
    body?: Body,
    init?: ContextRequestInit,
  ): Promise<TResult> {
    this.ensureContextPassed(init);
    return super.post<TResult>(path, body, init);
  }

  protected async patch<TResult = any>(
    path: string,
    body?: Body,
    init?: ContextRequestInit,
  ): Promise<TResult> {
    this.ensureContextPassed(init);
    return super.patch<TResult>(path, body, init);
  }

  protected async put<TResult = any>(
    path: string,
    body?: Body,
    init?: ContextRequestInit,
  ): Promise<TResult> {
    this.ensureContextPassed(init);
    return super.put<TResult>(path, body, init);
  }

  protected async delete<TResult = any>(
    path: string,
    params?: URLSearchParamsInit,
    init?: ContextRequestInit,
  ): Promise<TResult> {
    this.ensureContextPassed(init);
    return super.delete<TResult>(path, this.convertParams(params as URLSearchParamsInit), init);
  }

  private ensureContextPassed(init?: ContextRequestInit): void {
    if (init && init.context) {
      if (!init.cacheOptions) {
        init.cacheOptions = {};
      }

      if (typeof init.cacheOptions === 'object') {
        (init.cacheOptions as ContextCacheOptions).context = init.context;
      }
    }
  }

  private convertParams(params: URLSearchParamsInit): URLSearchParamsInit {
    // if params is plain object then convert it to URLSearchParam with help of qs.stringify - that way
    // we can be sure that nested object will be converted correctly to search params
    if (params && params.constructor === Object) {
      return new URLSearchParams(stringify(params, { encode: false }));
    }
    return params;
  }
}