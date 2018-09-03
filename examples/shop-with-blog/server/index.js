global.__SERVER__ = true; // eslint-disable-line no-underscore-dangle

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
process.on('uncaughtException', ex => {
  console.log('Uncaught Exception: ', ex);
});

const config = require('config');
const FalconServer = require('@deity/falcon-server');

const server = new FalconServer(config);
server.start();
