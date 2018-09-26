const util = require('util');
const winston = require('winston');

const { format } = winston;

class ServerLogger {
  constructor(level = 'info') {
    // stores references to transports so it's easy to remove/replace already defined transports
    this.transports = [];
    this.logger = winston.createLogger();

    // custom formatter for timestamp
    this.timestampFormat = format(info => {
      info.timestamp = this.fullDateFormat();
      return info;
    });

    this.setLogLevel(level);
  }

  setLogLevel(level) {
    this.logLevel = level;

    try {
      this.transports.forEach(transport => this.logger.remove(transport));
      this.transports.length = 0;
    } catch (e) {
      // Ignore exception - Winston throws an exception when trying to re-initialize Winston transports
    }

    this.transports.push(
      new winston.transports.Console({
        format: format.combine(
          format.colorize(),
          this.timestampFormat(),
          format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        ),
        level: this.logLevel
      })
    );

    this.transports.push(
      new winston.transports.File({
        filename: 'log/error.log',
        format: format.combine(
          this.timestampFormat(),
          format.align(),
          format.printf(info => `${info.timestamp} ${info.message}`)
        ),
        json: false,
        handleExceptions: true,
        level: 'error'
      })
    );

    this.transports.forEach(transport => this.logger.add(transport));
  }

  logAndThrow(e) {
    this.error(e);

    throw e;
  }

  log(...args) {
    this.logger.log(...args);
  }

  debug(...args) {
    this.logger.debug(...args);
  }

  verbose(...args) {
    this.logger.log('verbose', ...args);
  }

  warn(...args) {
    this.logger.warn(args);
  }

  info(...args) {
    this.logger.info(...args);
  }

  error(...args) {
    this.logger.error(...args);
  }

  fullDateFormat() {
    const date = new Date();

    return util.format(
      '[%s-%s-%s %s:%s:%s:%s]',
      date.getFullYear(),
      this.zeroPad(date.getMonth() + 1),
      this.zeroPad(date.getDate()),
      this.zeroPad(date.getHours()),
      this.zeroPad(date.getMinutes()),
      this.zeroPad(date.getSeconds()),
      this.zeroPad(date.getMilliseconds())
    );
  }

  zeroPad(value) {
    let valueString = value.toString();

    while (valueString.length < 2) {
      valueString = `0${valueString}`;
    }

    return valueString;
  }

  timeWithMilliseconds() {
    const date = new Date();

    return util.format(
      '[%s:%s:%s:%s]',
      this.zeroPad(date.getHours()),
      this.zeroPad(date.getMinutes()),
      this.zeroPad(date.getSeconds()),
      this.zeroPad(date.getMilliseconds())
    );
  }
}

module.exports = new ServerLogger();
