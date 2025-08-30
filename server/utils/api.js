class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong (ApiError)",
    errors = [],
    stack = "",
    cause = null
  ) {
    super(message, { cause });
    this.statusCode = statusCode;
    this.errors = errors;
    this.message = message;
    this.stack = stack || Error.captureStackTrace(this, this.constructor);
    this.cause = cause;
    this.data = null;
    this.success = false;
  }
}

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.log("Error Handler called");
      next(err);
    });
  };
};

export { ApiError, ApiResponse, asyncHandler };
