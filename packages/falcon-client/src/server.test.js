import 'jest-extended';
import Koa from 'koa';
import server from './server';

describe('Server', () => {
  it('Should properly call eventHandlers', () => {
    const onServerCreatedMock = jest.fn();
    const onServerInitializedMock = jest.fn();
    const serverConfig = {
      config: {
        serverSideRendering: true,
        logLevel: 'error'
      },
      onServerCreated: onServerCreatedMock,
      onServerInitialized: onServerInitializedMock
    };

    const serverApp = server(serverConfig);

    expect(serverApp).toBeInstanceOf(Koa);
    expect(onServerCreatedMock).toBeCalledWith(serverApp);
    expect(onServerInitializedMock).toBeCalledWith(serverApp);
    expect(onServerInitializedMock).toHaveBeenCalledAfter(onServerCreatedMock);
  });
});
