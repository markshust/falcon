import React from 'react';
import ReactDOM from 'react-dom';
import gql from 'graphql-tag';
import { FalconClientMock } from '@deity/falcon-client/test-utils';

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
      <FalconClientMock
        apollo={{ mocks }}
        i18next={{ initialI18nStore: { en: { common: { welcome: 'Welcome sentence' } } } }}
      >
        <App />
      </FalconClientMock>,
      div
    );

    expect(div.innerHTML).toEqual(expect.stringContaining('<h2>Welcome sentence</h2>'));
  });
});
