/**
 * Webpack Assets middleware.
 * @param {{includeWebManifest: boolean}} param config
 * @return {function(ctx: object, next: function): Promise<void>} Koa middleware
 */
export default ({ includeWebManifest }) => {
  // eslint-disable-next-line
  const assetsManifest = process.env.RAZZLE_ASSETS_MANIFEST && require(process.env.RAZZLE_ASSETS_MANIFEST);
  const assets = {
    clientJs: assetsManifest.client.js,
    clientCss: assetsManifest.client.css,
    vendorsJs: assetsManifest.vendors.js,
    ...(includeWebManifest ? { webmanifest: assetsManifest[''].webmanifest } : {})
  };

  return (ctx, next) => {
    ctx.state.webpackAssets = assets;

    return next();
  };
};
