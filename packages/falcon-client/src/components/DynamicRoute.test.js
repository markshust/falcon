import React from 'react';
import renderer from 'react-test-renderer';
import { Switch } from 'react-router-dom';
import { asyncComponent } from 'react-async-component';
import { FalconClientMock } from '../../test-utils';
import { wait } from '../../../../test/helpers';
import DynamicRoute from './DynamicRoute';
import { GET_URL } from './../graphql/url.gql';

describe('DynamicRoute', () => {
  it('Should render DynamicRoute content', async () => {
    const mocks = [
      {
        request: {
          query: GET_URL,
          variables: { path: 'test' }
        },
        result: {
          data: {
            url: { id: 100, type: 'foo', path: 'test', redirect: null }
          }
        }
      }
    ];

    const App = renderer.create(
      <FalconClientMock apollo={{ mocks }} router={{ initialEntries: ['/test'] }}>
        <Switch>
          <DynamicRoute
            loaderComponent={() => <span>Loading...</span>}
            components={{
              foo: asyncComponent({
                resolve: () => import('./../__mocks__/pages/Foo')
              })
            }}
          />
        </Switch>
      </FalconClientMock>
    );

    expect(App.toJSON().children).toContain('Loading...');
    await wait(100);

    expect(App.toJSON().children).toContain('Bar');
  });
});
