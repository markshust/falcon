import clientState from './clientState';

const config = require('config');

export default {
  config: { ...config },
  clientState
  // onServerCreated: server => { console.log('created'); },
  // onServerInitialized: server => { console.log('initialized'); },
  // onServerStarted: server => { console.log('started'); }
};
