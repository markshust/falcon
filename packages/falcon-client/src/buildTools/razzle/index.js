const spawn = require('cross-spawn');

module.exports = (scriptName, scriptArgs) => {
  const result = spawn.sync('node', [require.resolve(`razzle/scripts/${scriptName}`)].concat(scriptArgs), {
    stdio: 'inherit'
  });

  if (result.signal) {
    if (result.signal === 'SIGKILL') {
      console.log(
        'The build failed because the process exited too early. ' +
          'This probably means the system ran out of memory or someone called `kill -9` on the process.'
      );
    } else if (result.signal === 'SIGTERM') {
      console.log(
        'The build failed because the process exited too early. ' +
          'Someone might have called `kill` or `killall`, or the system could be shutting down.'
      );
    }

    process.exit(1);
  }
  process.exit(result.status);
};
