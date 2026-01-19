const logger = require('../config/logger');

// Central error handler - all errors bubble to here via next(err)
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  logger.error(`${req.method} ${req.url} — ${status} — ${message}`);

  res.status(status).json({
    error: true,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
