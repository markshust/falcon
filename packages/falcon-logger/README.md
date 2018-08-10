# @deity/falcon-logger
Utility tool used for logging in Falcon packages.

By default it uses just `console.log()` for all types of logs. Setting `global.__SERVER__ = true` before loading `@deity/falcon-logger` will load full logger that uses [winston](https://github.com/winstonjs/winston) package.

## Usage
Package exports a singleton `Logger` object that exposes logging and configuration methods. By default log level is set to "info" so there's no need to set log level if you want to work with "info" level.

```
const Logger = require('@deity/falcon-logger');
Logger.info('message to log');
```

## API
The same api is available in both modes:

**Logger.setLogLevel(logLevel)** - sets log level that should be used by winston. When using `console.log()` that method does nothing (ignores passed argument)

The following methods are available for logging on various levels:

**Logger.log(...args)** - generic logging

**Logger.logAndThrow(error)** - logs the error and throws it so it can be caught by higher level logic

**Logger.verbose(...args)** - uses verbose logging in winston

**Logger.debug(...args)** - for logging on "debug" level

**Logger.info(...args)** - for logging on "info" level

**Logger.warn(...args)** - for logging on "warn" level

**Logger.error(...args)** - for logging on "error" level
