const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {
  logger.error(err);
  const status = err.status || 500;
  res.status(status).json({ data: null, error: { message: err.message || 'Internal Server Error' } });
}

module.exports = errorHandler;
