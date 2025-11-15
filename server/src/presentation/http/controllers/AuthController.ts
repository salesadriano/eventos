import type { NextFunction, Request, Response } from "express";
import type { LoginUseCase } from "../../../application/usecases/auth/LoginUseCase";
import type { RefreshTokenUseCase } from "../../../application/usecases/auth/RefreshTokenUseCase";
import type { ValidateTokenUseCase } from "../../../application/usecases/auth/ValidateTokenUseCase";
import type {
  LoginRequest,
  RefreshTokenRequest,
} from "../../../application/dtos/AuthDtos";

interface AuthControllerDependencies {
  loginUseCase: LoginUseCase;
  refreshTokenUseCase: RefreshTokenUseCase;
  validateTokenUseCase: ValidateTokenUseCase;
}

export class AuthController {
  constructor(private readonly deps: AuthControllerDependencies) {}

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const loginRequest = req.body as LoginRequest;
      const result = await this.deps.loginUseCase.execute(loginRequest);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const refreshRequest = req.body as RefreshTokenRequest;
      const result = await this.deps.refreshTokenUseCase.execute(refreshRequest);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  validateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "") || "";
      const result = await this.deps.validateTokenUseCase.execute(token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}

