// eslint-disable-next-line no-underscore-dangle
global.__SERVER__ = true;
// eslint-disable-next-line import/no-extraneous-dependencies
const Logger = require('@deity/falcon-logger');

// disable logger for tests
Logger.setLogLevel('error');
