const spawn = require('cross-spawn');

function runScript(scriptName, scriptArgs) {
  const result = spawn.sync('node', [require.resolve(`razzle/scripts/${scriptName}`)].concat(scriptArgs), {
    stdio: 'inherit'
  });

  if (result.signal) {
    if (result.signal === 'SIGKILL') {
      throw new Error(
        'The build failed because the process exited too early. ' +
          'This probably means the system ran out of memory or someone called `kill -9` on the process.'
      );
    } else if (result.signal === 'SIGTERM') {
      throw new Error(
        'The build failed because the process exited too early. ' +
          'Someone might have called `kill` or `killall`, or the system could be shutting down.'
      );
    }
  }

  if (result.status !== 0) {
    throw new Error(`The build failed because the process exited with code ${result.status}.`);
  }

  return result;
}

module.exports = {
  runScript
};
