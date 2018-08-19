import React from 'react';
import App from './App';
import clientState from './clientState';

export default {
  component: <App />,
  config: {},
  clientState
  // onServerCreated: server => { console.log('created'); },
  // onServerInitialized: server => { console.log('initialized'); },
  // onServerStarted: server => { console.log('started'); }
};
