import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from 'react-apollo/test-utils';
import MemoryRouter from 'react-router-dom/MemoryRouter';
import Switch from 'react-router-dom/Switch';
import wait from 'waait';
import DynamicRoute from './components/DynamicRoute';
import { GET_URL } from './graphql/url.gql';

describe('falcon-client', () => {
  it('Should render DynamicRoute content', async () => {
    const mocks = [
      {
        request: {
          query: GET_URL,
          variables: { url: '/test' }
        },
        result: {
          data: {
            getUrl: { type: 'foo', url: '/test' }
          }
        }
      }
    ];

    const Foo = () => <p>Bar</p>;
    const components = { foo: Foo };

    const App = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/test']}>
          <Switch>
            <DynamicRoute components={components} />
          </Switch>
        </MemoryRouter>
      </MockedProvider>
    );

    const tree = App.toJSON();
    expect(tree.children).toContain('Loading...');
    await wait(0);

    const paragraphs = App.root.findByType('p');
    expect(paragraphs.children).toContain('Bar');
  });
});
