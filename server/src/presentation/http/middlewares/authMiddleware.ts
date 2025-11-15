import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../../domain/errors/ApplicationError";
import { JwtService } from "../../../infrastructure/auth/JwtService";
import { environment } from "../../../config/environment";

const jwtService = new JwtService(environment.jwt);

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    profile: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const payload = jwtService.verifyToken(token);

    req.user = {
      userId: payload.userId,
      email: payload.email,
      profile: payload.profile,
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      next(new UnauthorizedError("Invalid or expired token"));
    }
  }
};

