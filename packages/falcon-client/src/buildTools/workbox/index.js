/* eslint-disable import/no-extraneous-dependencies */
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

async function injectManifest() {
  try {
    const configuration = {
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
      dontCacheBustUrlsMatching: /\/static\/.*/
    };

    const { count, size, warnings } = await workbox.injectManifest(configuration);
    Logger.log(
      `Generated Service Worker ${swLocation} which will precache ${count} files, totaling ${formatBytes(size)}.\n`
    );
    if (warnings.length) {
      Logger.warn(warnings.join('\n'));
    }
  } catch (error) {
    Logger.error('Service Worker generation failed!');

    throw error;
  }
}

module.exports = {
  injectManifest
};
