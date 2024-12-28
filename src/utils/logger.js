const winston = require('winston');
require('winston-daily-rotate-file');

// Define the log format
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create the logger with daily file rotation
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple(),
    logFormat
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Daily rotated file transport
    new winston.transports.DailyRotateFile({
      filename: 'logs/%DATE%-application.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, // Compress old logs
      maxSize: '20m', // Max file size before rotation
      maxFiles: '30d', // Keep logs for 30 days
      level: 'info',
    }),
  ],
});

module.exports = logger;
