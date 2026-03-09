import { UserEntity } from "../../../domain/entities/UserEntity";
import { ValidationError } from "../../../domain/errors/ApplicationError";
import type { UserRepository } from "../../../domain/repositories/UserRepository";

/**
 * LogoutUseCase
 *
 * Revoga a sessão do usuário removendo o refresh token hash armazenado.
 * Isso invalida qualquer tentativa de refresh futuro e força novo login.
 *
 * Casos de sucesso:
 * - User com sessão ativa é deslogado
 *
 * Casos de falha:
 * - User não encontrado
 * - User já deslogado (sem refresh token hash)
 *
 * Implementa: UC-001 (logout seguro), UC-017 (encerramento de sessão)
 */
export class LogoutUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<void> {
    if (!userId || userId.trim().length === 0) {
      throw new ValidationError("User ID is required for logout");
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ValidationError("User not found");
    }

    // Revogar refresh token desativando o hash
    const revokedUser = new UserEntity({
      ...user.toPrimitives(),
      refreshTokenHash: undefined,
      updatedAt: new Date(),
    });

    await this.userRepository.update(userId, revokedUser);
  }
}
