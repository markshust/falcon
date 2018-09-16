import { ConfigurableConstructorParams } from '../types';
import ApiDataSource from './ApiDataSource';

export default abstract class Extension {
  public config: object;
  public name: string;
  public api?: ApiDataSource;
  /**
   * @param {object} config Extension config object
   * @param {string} name Extension short-name
   */
  constructor({ config = {}, name }: ConfigurableConstructorParams = {}) {
    this.name = name || this.constructor.name;
    this.config = config;
  }

  /**
   * Initializes extension in this method
   * Must return a result from "api.preInitialize()"
   * @return {Promise<TResult|null>} API DataSource preInitialize result
   */
  async initialize<TResult = any>(): Promise<TResult|null> {
    if (!this.api) {
      throw new Error(`"${this.name}" extension: API DataSource was not defined`);
    }

    return this.api.preInitialize<TResult>();
  }

  /**
   * GraphQL configuration getter
   * @return {object} GraphQL configuration object
   */
  async getGraphQLConfig(): Promise<object> {
    return {};
  }

  get fetchUrlPriority(): number {
    return (this.api as ApiDataSource).fetchUrlPriority;
  }
}
