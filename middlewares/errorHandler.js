const errorHandlerMiddleware = (err, req, res, next) => {
  const success = err.success;
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ success, message, statusCode });
};

module.exports = errorHandlerMiddleware;
