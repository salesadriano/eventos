import type {
  FederatedIdentityEntity,
  OAuthProviderType,
} from "../entities/FederatedIdentityEntity";

/**
 * FederatedIdentityRepository
 *
 * Contrato para persistência de identidades federadas.
 * Operações principais:
 * - Criar novo vínculo federado
 * - Buscar vínculo por provider + subject (único)
 * - Buscar todos os vínculos de um usuário
 * - Remover vínculo (logout federado)
 */
export interface FederatedIdentityRepository {
  create(identity: FederatedIdentityEntity): Promise<FederatedIdentityEntity>;
  findByProviderAndSubject(
    provider: OAuthProviderType,
    subject: string,
  ): Promise<FederatedIdentityEntity | null>;
  findByUserIdAndProvider(
    userId: string,
    provider: OAuthProviderType,
  ): Promise<FederatedIdentityEntity | null>;
  findAllByUserId(userId: string): Promise<FederatedIdentityEntity[]>;
  delete(id: string): Promise<void>;
}
