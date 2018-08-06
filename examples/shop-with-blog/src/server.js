import Express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';
import path from 'path';
import bodyParser from 'body-parser';
import Bluebird from 'bluebird';
import config from 'config';
import Initiator from 'falcon-core/helpers/Initiator';
import Logger from 'falcon-core/helpers/Logger';
import { setQuoteId } from 'falcon-core/redux/modules/cart';
import { getSessionStore, createSession } from 'falcon-core/helpers/session';
import getRoutes from './routes';
import createStore from './redux/create';

Bluebird.config({
  longStackTraces: true,
  warnings: true // note, run node with --trace-warnings to see full stack traces for warnings
});

function handleInitError(e) {
  Logger.error('Init error cannot start the server.');
  Logger.error(e);
  process.exit(20);
}

// todo move it closer to checkout result routes
// on which url clear quote as it's not valid for adding to cart like operations anymore
function clearQuoteIdMatch(location) {
  return location.match(/checkout\/result\/success/);
}

try {
  // initiate default winston logger
  Logger.setLogLevel(config.get('logLevel'));

  const app = new Express();

  const sessionStore = getSessionStore(config.get('sessionStore'));
  app.use(createSession({ ...{ name: 'session' }, ...config.get('session'), store: sessionStore }));
  app.use(compression());
  app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));

  app.use('/dist/service-worker.js', (req, res, next) => {
    res.setHeader('Service-Worker-Allowed', '/');
    return next();
  });

  app.use(Express.static(path.join(__dirname, '..', 'static')));
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  app.use(bodyParser.json());

  const initiator = new Initiator({
    errorFile: path.resolve(path.join(__dirname, '/views/errors/500.html')),
    app,
    getRoutes,
    runStore: createStore,
    clearQuoteIdMatch,
    setQuoteId
  });

  initiator.init().catch(handleInitError);
} catch (e) {
  handleInitError(e);
}
