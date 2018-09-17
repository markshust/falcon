const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

function resolvePackageDir(name) {
  return path.dirname(require.resolve(`${name}/package.json`));
}

module.exports = {
  razzle: {
    appPath: resolveApp('.'),
    appBuild: resolveApp('build'),
    appSrc: resolveApp('src'),
    appServerIndexJs: resolveApp('src/'),
    appClientIndexJs: resolveApp('src/client')
  },
  falconClient: {
    rootDir: resolvePackageDir('@deity/falcon-client'),
    appSrc: path.join(resolvePackageDir('@deity/falcon-client'), 'src'),
    appServerIndexJs: require.resolve('@deity/falcon-client/src/index'),
    appClientIndexJs: require.resolve('@deity/falcon-client/src/client')
  },
  resolvePackageDir
};
