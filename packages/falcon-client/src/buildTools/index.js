const path = require('path');
const fs = require('fs');
const Logger = require('@deity/falcon-logger');
const paths = require('./paths');

function failIfAppEntryFilesNotFound() {
  if (fs.existsSync(path.join(paths.razzle.appPath, `index.js`)) === false) {
    Logger.logAndThrow(`There is no 'index.js' file in '${paths.razzle.appPath}' directory!`);
  }
  if (fs.existsSync(path.join(paths.razzle.appPath, `falcon-client.config.js`)) === false) {
    Logger.logAndThrow(`There is no 'falcon-client.config.js' file in '${paths.razzle.appPath}' directory!`);
  }
}

function clearAppBuildDir() {
  fs.emptyDirSync(paths.razzle.appBuild);
}

module.exports = {
  failIfAppEntryFilesNotFound,
  clearAppBuildDir
};
