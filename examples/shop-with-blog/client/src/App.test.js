import React from 'react';
import ReactDOM from 'react-dom';
import gql from 'graphql-tag';
import { MockedProvider } from 'react-apollo/test-utils';
import MemoryRouter from 'react-router-dom/MemoryRouter';
import App from './App';

describe('<App />', () => {
  test('renders without exploding', () => {
    const mocks = [
      {
        request: {
          query: gql`
            query Hi {
              hi @client
            }
          `
        },
        result: {
          data: { hi: 'Hello world!' }
        }
      }
    ];
    const div = document.createElement('div');
    ReactDOM.render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </MockedProvider>,
      div
    );
  });
});
