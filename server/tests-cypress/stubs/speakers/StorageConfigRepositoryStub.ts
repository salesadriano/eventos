import { StorageRepositoryConfigEntity } from "../../../src/domain/entities/speakers/StorageRepositoryConfigEntity";
import { StorageConfigRepository } from "../../../src/domain/repositories/speakers/StorageConfigRepository";
import { AsyncMock } from "../../utils/AsyncMock";

export class StorageConfigRepositoryStub extends StorageConfigRepository {
  readonly getActiveMock = new AsyncMock<[], StorageRepositoryConfigEntity | null>(
    null
  );
  readonly saveMock = new AsyncMock<
    [StorageRepositoryConfigEntity],
    StorageRepositoryConfigEntity
  >(
    new StorageRepositoryConfigEntity({
      provider: "local",
      active: true,
      credentials: { basePath: "/tmp" },
    })
  );

  async getActive(): Promise<StorageRepositoryConfigEntity | null> {
    return this.getActiveMock.invoke();
  }

  async save(
    config: StorageRepositoryConfigEntity
  ): Promise<StorageRepositoryConfigEntity> {
    return this.saveMock.invoke(config);
  }
}
