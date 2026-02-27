export class ApplicationError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.details = details;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, new.target);
    }
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class ValidationError extends ApplicationError {
  constructor(message = "Validation failed", details?: unknown) {
    super(message, 400, details);
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}
