const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({ message: err.message });
};

module.exports = errorHandler;
