import React from 'react';
import ReactDOM from 'react-dom';
import gql from 'graphql-tag';
import { FalconClientMock } from '@deity/falcon-client/unitTesting';

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
      <FalconClientMock apollo={{ mocks }}>
        <App />
      </FalconClientMock>,
      div
    );
  });
});

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
    ReactDOM.render(
      <FalconClientMock apollo={{ mocks }}>
        <App />
      </FalconClientMock>,
      document.createElement('div')
    );
  });
});
