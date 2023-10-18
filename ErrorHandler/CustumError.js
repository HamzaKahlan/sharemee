class CustomError extends Error {
  constructor(message, statusCode = 500, success) {
    super(message);
    this.status = statusCode;
    this.success = success;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
