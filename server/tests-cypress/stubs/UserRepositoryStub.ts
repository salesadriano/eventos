import { UserEntity } from "../../src/domain/entities/UserEntity";
import { UserRepository } from "../../src/domain/repositories/UserRepository";
import { AsyncMock } from "../utils/AsyncMock";

export class UserRepositoryStub extends UserRepository {
  readonly findAllMock = new AsyncMock<[], UserEntity[]>([]);
  readonly findByIdMock = new AsyncMock<[string], UserEntity | null>(null);
  readonly findByEmailMock = new AsyncMock<[string], UserEntity | null>(null);
  readonly findByOAuthIdentityMock = new AsyncMock<
    [string, string],
    UserEntity | null
  >(null);
  readonly createMock = new AsyncMock<[UserEntity], UserEntity>(
    UserEntity.create({
      name: "temp",
      email: "temp@example.com",
      profile: "user",
    })
  );
  readonly updateMock = new AsyncMock<[string, UserEntity], UserEntity>(
    UserEntity.create({
      name: "temp",
      email: "temp@example.com",
      profile: "user",
    })
  );
  readonly deleteMock = new AsyncMock<[string], void>(undefined);

  async findAll(): Promise<UserEntity[]> {
    return this.findAllMock.invoke();
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.findByIdMock.invoke(id);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.findByEmailMock.invoke(email);
  }

  async findByOAuthIdentity(
    provider: string,
    subject: string
  ): Promise<UserEntity | null> {
    return this.findByOAuthIdentityMock.invoke(provider, subject);
  }

  async create(userEntity: UserEntity): Promise<UserEntity> {
    return this.createMock.invoke(userEntity);
  }

  async update(id: string, userEntity: UserEntity): Promise<UserEntity> {
    return this.updateMock.invoke(id, userEntity);
  }

  async delete(id: string): Promise<void> {
    await this.deleteMock.invoke(id);
  }
}
