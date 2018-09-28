import React from 'react';
import renderer from 'react-test-renderer';
import { Switch } from 'react-router-dom';
import gql from 'graphql-tag';
import { FalconClientMock } from '../../test-utils';
import { wait } from '../../../../test/helpers';
import DynamicRoute from './DynamicRoute';

describe('DynamicRoute', () => {
  it('Should render DynamicRoute content', async () => {
    const mocks = [
      {
        request: {
          query: gql`
            query URL($path: String!) {
              url(path: $path) {
                type
                redirect
                id
                path
              }
            }
          `,
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
            components={{
              foo: () => <p>Bar</p>
            }}
          />
        </Switch>
      </FalconClientMock>
    );

    const tree = App.toJSON();
    expect(tree.children).toContain('Loading...');
    await wait(0);

    const paragraphs = App.root.findByType('p');
    expect(paragraphs.children).toContain('Bar');
  });
});
