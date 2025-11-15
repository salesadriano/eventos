import jwt, { type SignOptions } from "jsonwebtoken";
import type { Environment } from "../../config/environment";

export interface TokenPayload {
  userId: string;
  email: string;
  profile: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class JwtService {
  constructor(private readonly config: Environment["jwt"]) {}

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(
      payload,
      this.config.secret,
      { expiresIn: this.config.accessTokenExpiry } as SignOptions
    );
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(
      payload,
      this.config.secret,
      { expiresIn: this.config.refreshTokenExpiry } as SignOptions
    );
  }

  generateTokenPair(payload: TokenPayload): TokenPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.config.secret) as TokenPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid token");
      }
      throw new Error("Token verification failed");
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.config.secret) as TokenPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Refresh token expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid refresh token");
      }
      throw new Error("Refresh token verification failed");
    }
  }
}

