/**
 * Custom Error Class for Application Errors
 * Extends the built-in Error class
 */
class AppError extends Error {
  /**
   * Create a new AppError
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default: 500)
   * @param {string} status - 'fail' for client errors, 'error' for server errors (default: based on statusCode)
   * @param {boolean} isOperational - Indicates if error is operational/expected (default: true)
   */
  constructor(message, statusCode, status, isOperational = true) {
    super(message);

    this.statusCode = statusCode || 500;
    this.status = status || (this.statusCode >= 500 ? 'error' : 'fail');
    this.isOperational = isOperational;

    // Capture stack trace (excluding constructor call from trace)
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types for common cases
class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation Failed', errors = []) {
    super(message, 422);
    this.errors = errors; // Array of validation errors
  }
}

class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalServerError
};