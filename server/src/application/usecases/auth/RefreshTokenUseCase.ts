import { ValidationError } from "../../../domain/errors/ApplicationError";
import type { UserRepository } from "../../../domain/repositories/UserRepository";
import { JwtService } from "../../../infrastructure/auth/JwtService";
import type {
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "../../dtos/AuthDtos";

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async execute(
    request: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    const payload = this.jwtService.verifyRefreshToken(request.refreshToken);

    const user = await this.userRepository.findById(payload.userId);

    if (!user) {
      throw new ValidationError("User not found");
    }

    const tokenPair = this.jwtService.generateTokenPair({
      userId: user.id,
      email: user.email,
      profile: user.profile,
    });

    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }
}

