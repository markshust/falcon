import 'jest-extended';
import React from 'react';
import Helmet from 'react-helmet';
import { asyncComponent } from 'react-async-component';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Koa from 'koa';
import supertest from 'supertest';
import server from './server';
import DynamicRoute from './components/DynamicRoute';

describe('Server', () => {
  let components;
  let Home;
  let App;

  beforeAll(() => {
    Helmet.canUseDOM = false;
    components = {
      shop: asyncComponent({
        resolve: () => import('./__mocks__/pages/Shop')
      }),
      post: asyncComponent({
        resolve: () => import('./__mocks__/pages/Post')
      })
    };

    Home = () => <div>Foo</div>;
    App = () => (
      <Switch>
        <Route exact path="/" component={Home} />
        <DynamicRoute components={components} />
      </Switch>
    );
  });
  it('Should properly call eventHandlers', () => {
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
      App: Home,
      configuration
    });

    expect(serverApp).toBeInstanceOf(Koa);
    expect(onServerCreatedMock).toBeCalledWith(serverApp);
    expect(onServerInitializedMock).toBeCalledWith(serverApp);
    expect(onServerInitializedMock).toHaveBeenCalledAfter(onServerCreatedMock);
  });

  it('Should render Home page (SSR)', async () => {
    const config = {
      logLevel: 'error',
      serverSideRendering: true,
      usePwaManifest: true,
      googleTagManager: {
        id: null
      },
      language: {
        default: 'en'
      }
    };
    const configuration = {
      config,
      configState: {
        defaults: {
          config
        }
      },
      onServerCreated: () => {},
      onServerInitialized: () => {}
    };
    const clientApolloSchema = {
      defaults: {},
      resolvers: {
        Query: {}
      }
    };

    const serverHandler = server({ App, configuration, clientApolloSchema }).callback();
    const response = await supertest(serverHandler).get('/');

    expect(response.headers).toContainKey('server-timing');
    expect(response.status).toBe(200);
    expect(response.text).toEqual(expect.stringContaining('Foo</div>'));
  });
});
