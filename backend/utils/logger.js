const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, errors } = format;
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Custom format for console logging
const consoleFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}] ${message}`;
  
  if (stack) {
    msg += `\n${stack}`;
  }
  
  if (Object.keys(metadata).length > 0) {
    msg += `\n${JSON.stringify(metadata, null, 2)}`;
  }
  
  return msg;
});

// Custom format for file logging
const fileFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  return JSON.stringify({
    timestamp,
    level,
    message,
    stack,
    ...metadata
  });
});

// Create logger instance
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  transports: [
    // Console transport (colored output)
    new transports.Console({
      format: combine(
        colorize(),
        consoleFormat
      ),
      handleExceptions: true
    }),
    
    // Daily rotating file transport (errors)
    new DailyRotateFile({
      filename: path.join(__dirname, '../logs/error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
      format: fileFormat
    }),
    
    // Daily rotating file transport (all logs)
    new DailyRotateFile({
      filename: path.join(__dirname, '../logs/combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: fileFormat
    })
  ],
  exitOnError: false
});

// Add stream for Express/Morgan logging if needed
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

module.exports = logger;