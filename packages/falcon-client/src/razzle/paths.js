const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const falconClientDir = path.dirname(require.resolve('@deity/falcon-client/package.json'));

module.exports = {
  razzle: {
    appBuild: resolveApp('build'),
    appSrc: resolveApp('src'),
    appServerIndexJs: resolveApp('src/'),
    appClientIndexJs: resolveApp('src/client')
  },
  falconClient: {
    rootDir: falconClientDir,
    appSrc: path.join(falconClientDir, 'src'),
    appServerIndexJs: require.resolve('@deity/falcon-client/src/index'),
    appClientIndexJs: require.resolve('@deity/falcon-client/src/client')
  }
};
