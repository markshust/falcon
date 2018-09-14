#!/usr/bin/env node
const Logger = require('@deity/falcon-logger');
const razzle = require('./../src/buildTools/razzle');
const workbox = require('./../src/buildTools/workbox');
const { failIfAppEntryFilesNotFound, clearAppBuildDir } = require('./../src/buildTools');

(async () => {
  const script = process.argv[2];
  const args = process.argv.slice(3);

  try {
    failIfAppEntryFilesNotFound();

    switch (script) {
      case 'start': {
        clearAppBuildDir();

        await razzle.runScript(script, args);
        break;
      }
      case 'build': {
        await razzle.runScript(script, args);
        await workbox.injectManifest();
        break;
      }
      case 'test': {
        await razzle.runScript(script, args);
        break;
      }
      default:
        Logger.log(`Unknown script "${script}".`);
        Logger.log('Perhaps you need to update @deity/falcon-client?');
        break;
    }

    process.exit();
  } catch (error) {
    process.exit(1);
  }
})();
