import 'jest-extended';
import React from 'react';
import Koa from 'koa';
import server from './server';

describe('Server', () => {
  it('Should properly call eventHandlers', () => {
    const App = () => <div>Foo</div>;
    const onServerCreatedMock = jest.fn();
    const onServerInitializedMock = jest.fn();
    const configuration = {
      config: {
        serverSideRendering: true,
        logLevel: 'error'
      },
      onServerCreated: onServerCreatedMock,
      onServerInitialized: onServerInitializedMock
    };

    const serverApp = server({
      App,
      configuration
    });

    expect(serverApp).toBeInstanceOf(Koa);
    expect(onServerCreatedMock).toBeCalledWith(serverApp);
    expect(onServerInitializedMock).toBeCalledWith(serverApp);
    expect(onServerInitializedMock).toHaveBeenCalledAfter(onServerCreatedMock);
  });
});
