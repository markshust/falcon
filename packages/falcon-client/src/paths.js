const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  razzle: {
    appSrc: resolveApp('src'),
    appServerIndexJs: resolveApp('src/'),
    appClientIndexJs: resolveApp('src/client')
  },
  falconClient: {
    appServerIndexJs: require.resolve('@deity/falcon-client/src/index'),
    appClientIndexJs: require.resolve('@deity/falcon-client/src/client')
  }
};
