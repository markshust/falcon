//  enable runtime transpilation to use ES6/7 in node
/* eslint-disable */
const fs = require('fs');
const babelrc = fs.readFileSync('./.babelrc');

try {
  const config = JSON.parse(babelrc);
  config.ignore = /node_modules\/(?!deity-*)/;

  require('babel-register')(config);
  require('babel-polyfill');
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}
