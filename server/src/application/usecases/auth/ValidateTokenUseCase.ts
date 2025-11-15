import type { UserRepository } from "../../../domain/repositories/UserRepository";
import { JwtService } from "../../../infrastructure/auth/JwtService";
import type { ValidateTokenResponse } from "../../dtos/AuthDtos";

export class ValidateTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async execute(token: string): Promise<ValidateTokenResponse> {
    try {
      const payload = this.jwtService.verifyToken(token);

      const user = await this.userRepository.findById(payload.userId);

      if (!user) {
        return { valid: false };
      }

      return {
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          profile: user.profile,
        },
      };
    } catch {
      return { valid: false };
    }
  }
}

