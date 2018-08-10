/**
 * Logger with facade pattern to have some browser and server side logging interface.
 */
let logger;

if (typeof __SERVER__ !== 'undefined' && __SERVER__) {
  logger = require('./serverLogger');
} else {
  // to avoid console is not defined errors
  const safeConsole = typeof console === 'undefined' ? null : console;

  // lightweight version of logger only for browser usage - must match ServerLogger public methods to keep
  // consistent isomorphic behaviour.
  logger = {
    // do nothing, just keep the interface compatible with server
    setLogLevel() {},

    log(...args) {
      if (safeConsole) {
        safeConsole.log(...args);
      }
    },

    logAndThrow(e) {
      if (safeConsole) {
        safeConsole.error(e);
      }

      throw e;
    },

    debug(...args) {
      if (safeConsole) {
        safeConsole.log(...args);
      }
    },

    warn(...args) {
      if (safeConsole) {
        safeConsole.log(...args);
      }
    },

    info(...args) {
      if (safeConsole) {
        safeConsole.log(...args);
      }
    },

    error(...args) {
      if (safeConsole) {
        safeConsole.error(...args);
      }
    },

    verbose(...args) {
      if (safeConsole) {
        safeConsole.log(...args);
      }
    }
  };
}

module.exports = logger;
