/**
 * Custom Logger Utility
 *
 * Provides structured logging for the Slack bot
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const LOG_LEVEL_NAMES = {
  0: "DEBUG",
  1: "INFO",
  2: "WARN",
  3: "ERROR",
};

const LOG_LEVEL_COLORS = {
  DEBUG: "\x1b[36m", // Cyan
  INFO: "\x1b[32m", // Green
  WARN: "\x1b[33m", // Yellow
  ERROR: "\x1b[31m", // Red
  RESET: "\x1b[0m",
};

// Get current log level from environment or default to INFO
const currentLogLevel =
  LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? LOG_LEVELS.INFO;

/**
 * Format timestamp for log messages
 *
 * @returns {string} Formatted timestamp
 */
function getTimestamp() {
  const now = new Date();
  return now.toISOString();
}

/**
 * Format log message with color and timestamp
 *
 * @param {string} level - Log level name
 * @param {string} message - Log message
 * @param {Object} metadata - Additional metadata to log
 * @returns {string} Formatted log string
 */
function formatLogMessage(level, message, metadata = {}) {
  const color = LOG_LEVEL_COLORS[level] || LOG_LEVEL_COLORS.RESET;
  const reset = LOG_LEVEL_COLORS.RESET;
  const timestamp = getTimestamp();

  let logString = `${color}[${timestamp}] [${level}]${reset} ${message}`;

  // Add metadata if present
  if (Object.keys(metadata).length > 0) {
    logString += `\n${color}Metadata:${reset} ${JSON.stringify(
      metadata,
      null,
      2
    )}`;
  }

  return logString;
}

/**
 * Log message if current log level allows it
 *
 * @param {number} level - Numeric log level
 * @param {string} message - Log message
 * @param {Object} metadata - Additional metadata
 */
function log(level, message, metadata = {}) {
  if (level >= currentLogLevel) {
    const levelName = LOG_LEVEL_NAMES[level];
    const formattedMessage = formatLogMessage(levelName, message, metadata);

    if (level >= LOG_LEVELS.ERROR) {
      console.error(formattedMessage);
    } else if (level >= LOG_LEVELS.WARN) {
      console.warn(formattedMessage);
    } else {
      console.log(formattedMessage);
    }
  }
}

/**
 * Logger class with convenient methods
 */
class Logger {
  constructor(context = "") {
    this.context = context;
  }

  /**
   * Log debug message
   *
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   */
  debug(message, metadata = {}) {
    const contextMessage = this.context
      ? `[${this.context}] ${message}`
      : message;
    log(LOG_LEVELS.DEBUG, contextMessage, metadata);
  }

  /**
   * Log info message
   *
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   */
  info(message, metadata = {}) {
    const contextMessage = this.context
      ? `[${this.context}] ${message}`
      : message;
    log(LOG_LEVELS.INFO, contextMessage, metadata);
  }

  /**
   * Log warning message
   *
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   */
  warn(message, metadata = {}) {
    const contextMessage = this.context
      ? `[${this.context}] ${message}`
      : message;
    log(LOG_LEVELS.WARN, contextMessage, metadata);
  }

  /**
   * Log error message
   *
   * @param {string} message - Log message
   * @param {Error|Object} error - Error object or metadata
   */
  error(message, error = null) {
    const contextMessage = this.context
      ? `[${this.context}] ${message}`
      : message;

    const metadata = {};
    if (error instanceof Error) {
      metadata.error = {
        message: error.message,
        stack: error.stack,
        name: error.name,
      };
    } else if (error) {
      metadata.error = error;
    }

    log(LOG_LEVELS.ERROR, contextMessage, metadata);
  }

  /**
   * Log Slack event
   *
   * @param {string} eventType - Type of Slack event
   * @param {Object} eventData - Event data
   */
  event(eventType, eventData = {}) {
    this.info(`Event: ${eventType}`, eventData);
  }

  /**
   * Log Slack command
   *
   * @param {string} command - Command name
   * @param {Object} commandData - Command data
   */
  command(command, commandData = {}) {
    this.info(`Command: ${command}`, commandData);
  }

  /**
   * Log message with custom level
   *
   * @param {string} level - Log level (debug, info, warn, error)
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   */
  log(level, message, metadata = {}) {
    const levelUpper = level.toUpperCase();
    if (LOG_LEVELS[levelUpper] !== undefined) {
      log(LOG_LEVELS[levelUpper], message, metadata);
    } else {
      this.warn(`Unknown log level: ${level}`, {
        originalMessage: message,
        metadata,
      });
    }
  }
}

/**
 * Create a logger instance with optional context
 *
 * @param {string} context - Context identifier for the logger
 * @returns {Logger} Logger instance
 */
function createLogger(context = "") {
  return new Logger(context);
}

/**
 * Default logger instance
 */
const defaultLogger = new Logger();

module.exports = {
  Logger,
  createLogger,
  logger: defaultLogger,
  LOG_LEVELS,
};
