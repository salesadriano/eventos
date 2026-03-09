import { UserEntity } from "../../../domain/entities/UserEntity";
import {
  UnauthorizedError,
  ValidationError,
} from "../../../domain/errors/ApplicationError";
import type { UserRepository } from "../../../domain/repositories/UserRepository";
import { JwtService } from "../../../infrastructure/auth/JwtService";
import { TokenHashService } from "../../../infrastructure/auth/TokenHashService";

/**
 * RevokeRefreshTokenUseCase
 *
 * Revoga um refresh token específico de um usuário.
 * Mais granular que LogoutUseCase - permite revogar apenas uma sessão enquanto
 * outras sessões (em outros dispositivos) continuam ativas.
 *
 * Fluxo:
 * 1. Usuário envia seu refresh token para revogação
 * 2. Validamos o token
 * 3. Comparamos hash com o armazenado
 * 4. Se válido, removemos o refresh token hash do usuário
 *
 * Nota: Com JTI (JWT ID) rastreamento, poderíamos permitir múltiplas sessões.
 * Por enquanto, uso o modelo simples de um refresh token por usuário.
 *
 * Implementa: UC-017 (revogação de token)
 */
export class RevokeRefreshTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly tokenHashService: TokenHashService,
  ) {}

  async execute(userId: string, refreshToken: string): Promise<void> {
    if (!userId || userId.trim().length === 0) {
      throw new ValidationError("User ID is required");
    }

    if (!refreshToken || refreshToken.trim().length === 0) {
      throw new ValidationError("Refresh token is required");
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ValidationError("User not found");
    }

    // Validar que o token é um refresh token válido
    try {
      this.jwtService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    // Validar que o token pertence a este usuário
    const incomingTokenHash = this.tokenHashService.hashToken(refreshToken);

    if (!user.refreshTokenHash || user.refreshTokenHash !== incomingTokenHash) {
      throw new UnauthorizedError(
        "Refresh token does not match current session",
      );
    }

    // Revogar o token
    const revokedUser = new UserEntity({
      ...user.toPrimitives(),
      refreshTokenHash: undefined,
      updatedAt: new Date(),
    });

    await this.userRepository.update(userId, revokedUser);
  }
}
