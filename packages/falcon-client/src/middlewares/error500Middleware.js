import path from 'path';
import fs from 'fs';
import Logger from '@deity/falcon-logger';
import send from 'koa-send';
import paths from '@hostSrc/clientApp/paths';

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

    const root = fs.existsSync(path.join(paths.razzle.appSrc, `views/errors/500.html`))
      ? path.join(paths.razzle.appSrc, `views/errors`)
      : path.join(paths.falconClient.appSrc, `views/errors`);

    ctx.status = 500;
    await send(ctx, '/500.html', { root });
  }
};
