import type { StorageProvider } from "../../../src/domain/entities/speakers/StorageRepositoryConfigEntity";
import { StorageProviderClient } from "../../../src/domain/repositories/speakers/StorageProviderClient";
import { AsyncMock } from "../../utils/AsyncMock";

export class StorageProviderClientStub implements StorageProviderClient {
  readonly testConnectionMock = new AsyncMock<[Record<string, string>], boolean>(
    true
  );

  constructor(public readonly provider: StorageProvider) {}

  async testConnection(credentials: Record<string, string>): Promise<boolean> {
    return this.testConnectionMock.invoke(credentials);
  }
}
