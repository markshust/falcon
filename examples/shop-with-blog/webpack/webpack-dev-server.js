const Express = require('express');
const webpack = require('webpack');
const config = require('config');
const webpackConfig = require('./dev.config');

const compiler = webpack(webpackConfig);

const host = config.get('host');
const port = Number(config.get('port')) + 1 || 3001;

const serverOptions = {
  contentBase: `http://${host}:${port}`,
  logLevel: 'debug',
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' }
};

const app = new Express();

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));

app.listen(port, err => {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', port);
  }
});
