const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const fs = require("fs");

const log_directory = path.join(__dirname, "..", "..", "logs");

// Ensure the logs directory exists
try {
  if (!fs.existsSync(log_directory)) {
    fs.mkdirSync(log_directory, { recursive: true });
  }
} catch (err) {
  console.error("Failed to create log directory:", err);
}

// Common format for both console and file
const commonFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    let output = `${timestamp} ${level.toUpperCase()}: ${message}`;
    if (stack) {
      // Preserve original error stack format
      output += `\n    ${stack}`;
    }
    return output;
  })
);

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "silly",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true })
  ),
  transports: [
    // Console transport with colors
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.colorize({
          all: true,
          colors: {
            error: "red",
            warn: "yellow",
            info: "blue",
            http: "white",
            verbose: "blue",
            debug: "white",
            silly: "white",
          },
        }),
        winston.format.printf(({ timestamp, level, message, stack }) => {
          let output = `${timestamp} ${level}: ${message}`;
          // Include stack trace in the same string to maintain color
          if (stack) {
            output += `\n${stack}`;
          }
          return output;
        })
      ),
    }),

    // Single file for all logs
    new DailyRotateFile({
      filename: path.join(log_directory, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: commonFormat,
      level: "silly",
    }),
  ],
});

// Handle uncaught exceptions
logger.exceptions.handle(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      winston.format.colorize({
        all: true,
      }),
      winston.format.printf(({ timestamp, level, message, stack }) => {
        // Keep the entire error message including stack in one string
        let output = `${timestamp} ${level}: ${message}`;
        if (stack) {
          output += `\n${stack}`;
        }
        return output;
      })
    ),
  }),
  new DailyRotateFile({
    filename: path.join(log_directory, "combined-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
    format: commonFormat,
  })
);

module.exports = logger;
