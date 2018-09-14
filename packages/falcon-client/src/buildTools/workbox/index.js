const workbox = require('workbox-build');
const Logger = require('@deity/falcon-logger');
const path = require('path');
const paths = require('./../paths');

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} Bytes`;
  else if (bytes < 1048576) return `${(bytes / 1024).toFixed(3)} KB`;
  else if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(3)} MB`;
  return `${(bytes / 1073741824).toFixed(3)} GB`;
}

const swLocation = path.join('build', 'public', 'sw.js');

function injectManifest() {
  return workbox
    .injectManifest({
      swSrc: path.join(paths.falconClient.appSrc, 'serviceWorker/sw.js'),
      swDest: path.join(paths.razzle.appPath, swLocation),
      maximumFileSizeToCacheInBytes: 8 * 1024 * 1024, // 8MB
      globDirectory: '.',
      globPatterns: ['build/public/**/*.{js,json,html,css,ico,png,jpg,gif,svg,eot,ttf,woff,woff2}'],
      modifyUrlPrefix: {
        'build/public': ''
      },
      templatedUrls: {
        '/app-shell': [
          'build/public/static/js/@(client|vendor)*.js',
          'build/public/static/css/bundle*.css',
          'build/server.js'
        ]
      },
      dontCacheBustUrlsMatching: /\/static\/(js\/(.*).(.*).js|css\/(.*).(.*).css)/
      // injectionPointRegexp:
      // manifestTransforms: []
    })
    .then(({ count, size /* warnings:[] */ }) => {
      Logger.log(
        `Generated Service Worker ${swLocation} which will precache ${count} files, totaling ${formatBytes(size)}.\n`
      );
    })
    .catch(x => {
      Logger.error('Service Worker Generation Failed!\n', x);
      Logger.error('\n');

      return Promise.reject(x);
    });
}

module.exports = {
  injectManifest
};
