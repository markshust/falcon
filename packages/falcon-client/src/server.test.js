// eslint-disable-next-line import/no-extraneous-dependencies
import 'jest-extended';
import React from 'react';
import Helmet from 'react-helmet';
import { asyncComponent } from 'react-async-component';
import { Route, Switch } from 'react-router-dom';
import { translate } from 'react-i18next';
import Koa from 'koa';
import supertest from 'supertest';
import webServer from './server';
import DynamicRoute from './components/DynamicRoute';

describe('Server', () => {
  it('Should properly call eventHandlers', () => {
    const onServerCreatedMock = jest.fn();
    const onServerInitializedMock = jest.fn();
    const onServerStartedMock = jest.fn();
    const config = {
      serverSideRendering: true,
      useWebManifest: true,
      logLevel: 'error'
    };
    const configuration = {
      config,
      configSchema: {
        defaults: {
          config
        }
      },
      onServerCreated: onServerCreatedMock,
      onServerInitialized: onServerInitializedMock,
      onServerStarted: onServerStartedMock
    };

    const server = webServer({
      App: () => <div />,
      configuration,
      clientApolloSchema: {
        defaults: {}
      },
      webpackAssets: {}
    });
    server.started();

    expect(server.instance).toBeInstanceOf(Koa);
    expect(onServerCreatedMock).toBeCalledWith(server.instance);

    expect(onServerInitializedMock).toBeCalledWith(server.instance);
    expect(onServerInitializedMock).toHaveBeenCalledAfter(onServerCreatedMock);

    expect(onServerStartedMock).toBeCalledWith(server.instance);
    expect(onServerStartedMock).toHaveBeenCalledAfter(onServerInitializedMock);
  });

  it('Should render Home page (SSR)', async () => {
    Helmet.canUseDOM = false;
    const Home = translate()(({ t }) => (
      <div>
        <h2>Foo</h2>
        <p>{t('key')}</p>
      </div>
    ));

    const App = () => (
      <Switch>
        <Route exact path="/" component={Home} />
        <DynamicRoute
          components={{
            shop: asyncComponent({
              resolve: () => import('./__mocks__/pages/Shop')
            }),
            post: asyncComponent({
              resolve: () => import('./__mocks__/pages/Post')
            })
          }}
        />
      </Switch>
    );

    const config = {
      logLevel: 'error',
      serverSideRendering: true,
      useWebManifest: true,
      googleTagManager: {
        id: null
      },
      i18n: {
        lng: 'en',
        resources: { en: { common: { key: 'foo bar baz' } } }
      }
    };
    const configuration = {
      config,
      configSchema: {
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

    const serverHandler = webServer({
      App,
      configuration,
      clientApolloSchema,
      webpackAssets: {}
    }).callback();
    const response = await supertest(serverHandler).get('/');

    expect(response.status).toBe(200);
    expect(response.headers).toContainKey('server-timing');
    expect(response.text).toEqual(expect.stringContaining('<h2>Foo</h2>'));
    expect(response.text).toEqual(expect.stringContaining('<p>foo bar baz</p>'));
  });
});
