#!/usr/bin/env node
const buildTools = require('./../src/buildTools');
const razzle = require('./../src/buildTools/razzle');

const script = process.argv[2];
const args = process.argv.slice(3);

buildTools.failIfAppEntryFilesNotFound();

switch (script) {
  case 'start': {
    buildTools.clearAppBuildDir();
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
