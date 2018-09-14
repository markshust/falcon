const spawn = require('cross-spawn');
const Logger = require('@deity/falcon-logger');

function runScript(scriptName, scriptArgs) {
  const result = spawn.sync('node', [require.resolve(`razzle/scripts/${scriptName}`)].concat(scriptArgs), {
    stdio: 'inherit'
  });

  if (result.signal) {
    if (result.signal === 'SIGKILL') {
      Logger.log(
        'The build failed because the process exited too early. ' +
          'This probably means the system ran out of memory or someone called `kill -9` on the process.'
      );
    } else if (result.signal === 'SIGTERM') {
      Logger.log(
        'The build failed because the process exited too early. ' +
          'Someone might have called `kill` or `killall`, or the system could be shutting down.'
      );
    }
    return Promise.reject(result);
  }

  if (result.status !== 0) {
    return Promise.reject(result);
  }

  return Promise.resolve(result);
}

module.exports = {
  runScript
};
