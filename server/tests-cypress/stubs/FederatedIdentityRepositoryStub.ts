import { FederatedIdentityEntity } from "../../src/domain/entities/FederatedIdentityEntity";
import { FederatedIdentityRepository } from "../../src/domain/repositories/FederatedIdentityRepository";
import { AsyncMock } from "../utils/AsyncMock";

export class FederatedIdentityRepositoryStub implements FederatedIdentityRepository {
  readonly createMock = new AsyncMock<[FederatedIdentityEntity], FederatedIdentityEntity>(
    null as any // Will be set in tests
  );
  readonly findByProviderAndSubjectMock = new AsyncMock<
    [string, string],
    FederatedIdentityEntity | null
  >(null);
  readonly findByUserIdAndProviderMock = new AsyncMock<
    [string, string],
    FederatedIdentityEntity | null
  >(null);
  readonly findAllByUserIdMock = new AsyncMock<[string], FederatedIdentityEntity[]>(
    []
  );
  readonly deleteMock = new AsyncMock<[string], void>(undefined);

  async create(identity: FederatedIdentityEntity): Promise<FederatedIdentityEntity> {
    return this.createMock.invoke(identity);
  }

  async findByProviderAndSubject(
    provider: string,
    subject: string
  ): Promise<FederatedIdentityEntity | null> {
    return this.findByProviderAndSubjectMock.invoke(provider, subject);
  }

  async findByUserIdAndProvider(
    userId: string,
    provider: string
  ): Promise<FederatedIdentityEntity | null> {
    return this.findByUserIdAndProviderMock.invoke(userId, provider);
  }

  async findAllByUserId(userId: string): Promise<FederatedIdentityEntity[]> {
    return this.findAllByUserIdMock.invoke(userId);
  }

  async delete(id: string): Promise<void> {
    await this.deleteMock.invoke(id);
  }
}
