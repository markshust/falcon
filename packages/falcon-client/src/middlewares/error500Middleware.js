import send from 'koa-send';
import fs from 'fs';
import path from 'path';
import resolve from 'resolve';
import Logger from '@deity/falcon-logger';

/**
 * Custom 500 error middleware.
 * @returns {Function} Koa2 middleware
 */
export default () => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    Logger.error(`Internal Server Error:\n  ${error}`);

    let viewsDir = path.resolve(__dirname, './../', 'views');
    if (fs.existsSync(path.join(viewsDir, '/errors/500.html')) === false) {
      viewsDir = path.resolve(resolve.sync('@deity/falcon-client/views/errors/500.html'), './../..');
    }

    await send(ctx, '/errors/500.html', { root: viewsDir });
  }
};
