import { UserEntity } from "../../../domain/entities/UserEntity";
import {
  UnauthorizedError,
  ValidationError,
} from "../../../domain/errors/ApplicationError";
import type { UserRepository } from "../../../domain/repositories/UserRepository";
import { JwtService } from "../../../infrastructure/auth/JwtService";
import { TokenHashService } from "../../../infrastructure/auth/TokenHashService";
import type {
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "../../dtos/AuthDtos";

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly tokenHashService: TokenHashService
  ) {}

  async execute(
    request: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    if (!request.refreshToken) {
      throw new ValidationError("Refresh token is required");
    }

    const payload = this.jwtService.verifyRefreshToken(request.refreshToken);

    const user = await this.userRepository.findById(payload.userId);

    if (!user) {
      throw new ValidationError("User not found");
    }

    if (!user.refreshTokenHash) {
      throw new UnauthorizedError("Refresh token is not active");
    }

    const incomingTokenHash = this.tokenHashService.hashToken(
      request.refreshToken
    );

    if (user.refreshTokenHash !== incomingTokenHash) {
      await this.userRepository.update(
        user.id,
        new UserEntity({
          ...user.toPrimitives(),
          refreshTokenHash: undefined,
          updatedAt: new Date(),
        })
      );
      throw new UnauthorizedError(
        "Refresh token reuse detected. Session revoked"
      );
    }

    const tokenPair = this.jwtService.generateTokenPair({
      userId: user.id,
      email: user.email,
      profile: user.profile,
    });

    await this.userRepository.update(
      user.id,
      new UserEntity({
        ...user.toPrimitives(),
        refreshTokenHash: this.tokenHashService.hashToken(tokenPair.refreshToken),
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
    );

    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }
}
