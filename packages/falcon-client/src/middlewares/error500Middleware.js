import Logger from '@deity/falcon-logger';

/**
 * Custom 500 error middleware.
 * @returns {Function} Koa2 middleware
 */
export default () => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = 500;
    ctx.body = 'Internal Server Error';

    Logger.error(`Internal Server Error:\n  ${error}`);

    try {
      ctx.type = 'html';
      ctx.body = require('app-src/views/errors/500.html');
    } catch (e) {
      // using default view instead
      ctx.type = 'html';
      ctx.body = require('falcon-client/src/views/errors/500.html');
    }
  }
};
