import path from 'path';
import fs from 'fs';
import Logger from '@deity/falcon-logger';
import send from 'koa-send';

/**
 * Custom 500 error middleware.
 * @async
 * @param {string} ctx - Koa context.
 * @param {string} next - Koa next.
 */
export default async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    Logger.error(`Error: ${error}`);

    path.resolve(path.join(__dirname, '/../views/errors/500.html'));

    const rootDir =
      process.env.NODE_ENV === 'production'
        ? path.resolve(path.join(process.env.RAZZLE_PUBLIC_DIR, './../../views/errors'))
        : path.resolve(path.join(process.env.RAZZLE_PUBLIC_DIR, './../views/errors'));

    ctx.status = 500;

    if (fs.existsSync(path.join(rootDir, `500.html`))) {
      await send(ctx, '/500.html', { root });
    } else {
      ctx.body = 'Internal Server Error';
    }
  }
};
