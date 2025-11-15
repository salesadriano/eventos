import type { NextFunction, Request, Response } from "express";
import { ApplicationError } from "../../../domain/errors/ApplicationError";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const applicationError = err instanceof ApplicationError ? err : null;
  const status = applicationError?.statusCode ?? 500;

  if (!applicationError) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  const message =
    applicationError?.message ??
    (err instanceof Error ? err.message : "Internal server error");

  res.status(status).json({
    message,
    details: applicationError?.details,
  });
};
