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
  constructor({ config, name }: ConfigurableConstructorParams) {
    this.name = name || this.constructor.name;
    this.config = config;
  }

  async initialize(): Promise<void|any> {
    if (!this.api) {
      throw new Error(`"${this.name}" extension: API DataSource was not defined`);
    }

    return this.api.preInitialize();
  }

  /**
   * GraphQL configuration getter
   * @return {object} GraphQL configuration object
   */
  async getGraphQLConfig(): Promise<object> {
    return {};
  }
}
