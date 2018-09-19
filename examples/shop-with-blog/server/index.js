global.__SERVER__ = true; // eslint-disable-line no-underscore-dangle

const FalconServer = require('@deity/falcon-server');

const server = new FalconServer({
  port: 4000
});
server.start();
