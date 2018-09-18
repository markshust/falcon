import Extension from './Extension';
import ApiDataSource from './ApiDataSource';

class CustomExtension extends Extension {}
class CustomApiDataSource extends ApiDataSource {}

describe('Extension', () => {
  let ext: CustomExtension;

  beforeEach(() => {
    ext = new CustomExtension({
      config: {}
    });
  });

  it('Should create an instance of Extension', async () => {
    expect(ext.config).toEqual({});
    expect(ext.name).toBe('CustomExtension');
  });

  it('Should throw an error while initializing (with no assigned API DataSource instance)', async () => {
    try {
      await ext.initialize();
      expect(false).toBeTrue();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual(expect.stringContaining('API DataSource was not defined'));
    }
  });

  it('Should initialize correctly (with the assigned API DataSource instance)', async () => {
    const api: CustomApiDataSource = new CustomApiDataSource({});
    const preInitializeSpy: jest.SpyInstance = jest.spyOn(api, 'preInitialize');
    ext.api = api;

    try {
      await ext.initialize();
      expect(preInitializeSpy).toHaveBeenCalled();
    } catch (error) {
      expect(false).toBeTrue();
    }
    preInitializeSpy.mockRestore();
  });
});