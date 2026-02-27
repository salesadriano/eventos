import { expect } from "chai";
import { TestStorageConnectionUseCase } from "../../../src/application/usecases/repository/TestStorageConnectionUseCase";
import { StorageRepositoryConfigEntity } from "../../../src/domain/entities/speakers/StorageRepositoryConfigEntity";
import { NotFoundError } from "../../../src/domain/errors/ApplicationError";
import { StorageConfigRepositoryStub } from "../../stubs/speakers/StorageConfigRepositoryStub";
import { StorageProviderClientStub } from "../../stubs/speakers/StorageProviderClientStub";
import { expectAsyncError } from "../../utils/expectError";

export const testStorageConnectionUseCaseSpecs = {
  async testsConnectionForActiveProvider(): Promise<void> {
    const configRepository = new StorageConfigRepositoryStub();
    const providerClient = new StorageProviderClientStub("local");

    configRepository.getActiveMock.resolveWith(
      new StorageRepositoryConfigEntity({
        provider: "local",
        active: true,
        credentials: { basePath: "/tmp/uploads" },
      })
    );

    providerClient.testConnectionMock.resolveWith(true);

    const useCase = new TestStorageConnectionUseCase(
      configRepository,
      new Map([["local", providerClient]])
    );

    const result = await useCase.execute();

    expect(result).to.deep.equal({ provider: "local", connected: true });
  },

  async throwsWhenNoActiveConfigExists(): Promise<void> {
    const configRepository = new StorageConfigRepositoryStub();
    configRepository.getActiveMock.resolveWith(null);

    const useCase = new TestStorageConnectionUseCase(
      configRepository,
      new Map()
    );

    await expectAsyncError(() => useCase.execute(), NotFoundError);
  },
};
