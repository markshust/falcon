import path from 'path';
import fs from 'fs';
import Logger from '@deity/falcon-logger';
import send from 'koa-send';
import paths from '@hostSrc/razzle/paths';

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

    // path.resolve(path.join(__dirname, '/../views/errors/500.html'));

    // TODO way of resolving paths (@hostSrc/razzle/paths) needs to be fixed!
    const root = fs.existsSync(path.join(paths.razzle.appSrc, `views/errors/500.html`))
      ? path.join(paths.razzle.appSrc, `views/errors`)
      : path.join(paths.falconClient.appSrc, `views/errors`);

    ctx.status = 500;
    await send(ctx, '/500.html', { root });

    // const rootDir =
    //   process.env.NODE_ENV === 'production'
    //     ? path.resolve(path.join(process.env.RAZZLE_PUBLIC_DIR, './../../views/errors'))
    //     : path.resolve(path.join(process.env.RAZZLE_PUBLIC_DIR, './../views/errors'));

    // ctx.status = 500;

    // if (fs.existsSync(path.join(rootDir, `500.html`))) {
    //   await send(ctx, '/500.html', { root });
    // } else {
    //   ctx.body = 'Internal Server Error';
    // }
  }
};
