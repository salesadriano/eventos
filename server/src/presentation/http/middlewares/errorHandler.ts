import type { NextFunction, Request, Response } from "express";
import { ApplicationError } from "../../../domain/errors/ApplicationError";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  void _next;
  const applicationError = err instanceof ApplicationError ? err : null;
  const status = applicationError?.statusCode ?? 500;

  if (!applicationError) {
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
