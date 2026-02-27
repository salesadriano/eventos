import { NotFoundError, ValidationError } from "../../../domain/errors/ApplicationError";
import { StorageConfigRepository } from "../../../domain/repositories/speakers/StorageConfigRepository";
import { StorageProviderClient } from "../../../domain/repositories/speakers/StorageProviderClient";

export class TestStorageConnectionUseCase {
  constructor(
    private readonly storageConfigRepository: StorageConfigRepository,
    private readonly storageProviders: Map<string, StorageProviderClient>
  ) {}

  async execute(): Promise<{ provider: string; connected: boolean }> {
    const activeConfig = await this.storageConfigRepository.getActive();

    if (!activeConfig || !activeConfig.active) {
      throw new NotFoundError("No active storage configuration found");
    }

    const providerClient = this.storageProviders.get(activeConfig.provider);

    if (!providerClient) {
      throw new ValidationError(`Storage provider ${activeConfig.provider} is not configured`);
    }

    const connected = await providerClient.testConnection(activeConfig.credentials);

    return {
      provider: activeConfig.provider,
      connected,
    };
  }
}
