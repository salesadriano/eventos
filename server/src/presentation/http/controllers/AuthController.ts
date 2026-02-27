import type { NextFunction, Request, Response } from "express";
import type { OAuthProvider } from "../../../domain/entities/UserEntity";
import { ValidationError } from "../../../domain/errors/ApplicationError";
import type { LoginUseCase } from "../../../application/usecases/auth/LoginUseCase";
import type { ListOAuthProvidersUseCase } from "../../../application/usecases/auth/ListOAuthProvidersUseCase";
import type { OAuthCallbackUseCase } from "../../../application/usecases/auth/OAuthCallbackUseCase";
import type { RefreshTokenUseCase } from "../../../application/usecases/auth/RefreshTokenUseCase";
import type { StartOAuthAuthorizationUseCase } from "../../../application/usecases/auth/StartOAuthAuthorizationUseCase";
import type { ValidateTokenUseCase } from "../../../application/usecases/auth/ValidateTokenUseCase";
import type {
  OAuthCallbackRequest,
  LoginRequest,
  RefreshTokenRequest,
  StartOAuthRequest,
} from "../../../application/dtos/AuthDtos";

interface AuthControllerDependencies {
  loginUseCase: LoginUseCase;
  refreshTokenUseCase: RefreshTokenUseCase;
  validateTokenUseCase: ValidateTokenUseCase;
  listOAuthProvidersUseCase: ListOAuthProvidersUseCase;
  startOAuthAuthorizationUseCase: StartOAuthAuthorizationUseCase;
  oauthCallbackUseCase: OAuthCallbackUseCase;
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
      this.setRefreshTokenCookie(res, result.refreshToken);
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
      const bodyRequest = req.body as RefreshTokenRequest;
      const refreshToken =
        bodyRequest.refreshToken || this.extractCookie(req, "refreshToken");

      if (!refreshToken) {
        throw new ValidationError("Refresh token is required");
      }

      const refreshRequest: RefreshTokenRequest = { refreshToken };
      const result = await this.deps.refreshTokenUseCase.execute(refreshRequest);
      this.setRefreshTokenCookie(res, result.refreshToken);
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

  listOAuthProviders = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = this.deps.listOAuthProvidersUseCase.execute();
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  startOAuthAuthorization = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const payload = req.body as StartOAuthRequest;
      const provider = req.params.provider;
      const result = this.deps.startOAuthAuthorizationUseCase.execute({
        provider,
        codeChallenge: payload.codeChallenge,
        redirectUri: payload.redirectUri,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  oauthCallback = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const payload = req.body as OAuthCallbackRequest;
      const provider = req.params.provider as OAuthProvider;
      const result = await this.deps.oauthCallbackUseCase.execute({
        provider,
        state: payload.state,
        code: payload.code,
        codeVerifier: payload.codeVerifier,
        redirectUri: payload.redirectUri,
      });

      this.setRefreshTokenCookie(res, result.refreshToken);

      res.json({
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  };

  private extractCookie(req: Request, cookieName: string): string | undefined {
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) {
      return undefined;
    }

    const cookies = cookieHeader.split(";").map((rawCookie) => rawCookie.trim());
    const tokenCookie = cookies.find((cookie) =>
      cookie.startsWith(`${cookieName}=`)
    );

    if (!tokenCookie) {
      return undefined;
    }

    return decodeURIComponent(tokenCookie.slice(cookieName.length + 1));
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
