const logger = require('../utils/logger');

const errorHandler = (err, req, res) => {
  logger.error(err.message);
  console.log(res, 'res');
  res.status(err.status || 500).json({ message: err.message });
};

module.exports = errorHandler;
