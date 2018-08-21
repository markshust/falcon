#!/usr/bin/env node
const fs = require('fs-extra');
const razzle = require('./../src/razzle');
const paths = require('./../src/razzle/paths');

const script = process.argv[2];
const args = process.argv.slice(3);

switch (script) {
  case 'start': {
    fs.emptyDirSync(paths.razzle.appBuild);
    razzle(script, args);
    break;
  }
  case 'build':
  case 'test': {
    razzle(script, args);
    break;
  }
  default:
    console.log(`Unknown script "${script}".`);
    console.log('Perhaps you need to update @deity/falcon-client?');
    break;
}
