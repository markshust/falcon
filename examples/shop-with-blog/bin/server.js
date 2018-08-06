#!/usr/bin/env node
/* eslint-disable */
const path = require('path');
const rootDir = path.resolve(__dirname, '..');
/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

// auto restarts the process when code changes are detected
if (__DEVELOPMENT__) {
  if (
    !require('piping')({
      hook: true,
      ignore: /(\/\.|~$|\.json|\.scss$)/i
    })
  ) {
    return;
  }
}

require('../server.babel'); // babel registration (runtime transpilation for node)

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(
  require('@deity/falcon-core/webpack/webpack-isomorphic-tools')
).server(rootDir, function() {
  require('../src/server');
});
