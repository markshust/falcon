const FalconServer = require('./');
const supertest = require('supertest');

describe('Falcon Server', () => {
  const config = {
    debug: true,
    port: 4000,
    logLevel: 'error',
    apis: [
      {
        name: 'fake-api',
        package: 'fake-backend-api',
        config: {}
      }
    ],
    extensions: [
      {
        package: 'fake-shop-extension',
        config: {
          api: 'fake-api'
        }
      }
    ],
    session: {
      keys: ['secret']
    }
  };

  it('Should handle an incoming request to an API DataSource endpoint', async () => {
    const server = new FalconServer(config);
    await server.initialize();
    const serverCallback = server.app.callback();
    const response = await supertest(serverCallback).get('/api/info');
    expect(response.text).toBe('foo');
  });
});
