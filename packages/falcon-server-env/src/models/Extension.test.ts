import Extension from './Extension';
import ApiDataSource from './ApiDataSource';

class CustomExtension extends Extension {}
class CustomApiDataSource extends ApiDataSource {}

describe('Extension', () => {
  it('Should create an instance of Extension', async () => {
    const ext: CustomExtension = new CustomExtension({
      config: {}
    });

    try {
      await ext.initialize();
      expect(false).toBeTrue();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual(expect.stringContaining('API DataSource was not defined'));
    }

    const api: CustomApiDataSource = new CustomApiDataSource({});
    const preInitializeSpy: jest.SpyInstance = jest.spyOn(api, 'preInitialize');
    ext.api = api;

    await ext.initialize();
    expect(preInitializeSpy).toHaveBeenCalled();

    preInitializeSpy.mockRestore();
  });
});