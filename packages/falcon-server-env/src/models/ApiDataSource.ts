import { DataSourceConfig } from 'apollo-datasource';
import { RESTDataSource } from 'apollo-datasource-rest';
import ContextHTTPCache from '../cache/ContextHTTPCache';
import {
  ApiDataSourceEndpoint,
  ConfigurableConstructorParams,
  ContextData,
  ContextCacheOptions
} from '../types';
import {
  Request,
  RequestInit,
  Response,
  URLSearchParamsInit,
} from 'apollo-server-env';
import helpers, { IAPIHelpers } from '../helpers';

export default abstract class ApiDataSource<TContext = any, THelpers = any> extends RESTDataSource<TContext> {
  public name: string;
  public config: object;
  public fetchUrlPriority: number = 1;
  public helpers: THelpers | IAPIHelpers = helpers;

  /**
   * @param {object} config API DataSource config
   * @param {string} name API DataSource short-name
   */
  constructor({ config, name }: ConfigurableConstructorParams) {
    super();
    this.name = name || this.constructor.name;
    this.config = config as object;
  }

  /**
   * This method should be used for "pre-initializing" API DataSource instance,
   * for example - for fetching API backend configuration required for Server start up
   * @return {Promise<undefined|mixed>} Result object
   */
  async preInitialize(): Promise<void|any> {
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

  protected async get<TResult = any>(
    path: string,
    params?: URLSearchParamsInit,
    init?: RequestInit & ContextData
  ): Promise<TResult> {
    if (init && init.context) {
      if (!init.cacheOptions) {
        init.cacheOptions = {};
      }

      if (typeof init.cacheOptions === 'object') {
        (init.cacheOptions as ContextCacheOptions).context = init.context;
      }
    }

    return super.get(path, params, init);
  }
}