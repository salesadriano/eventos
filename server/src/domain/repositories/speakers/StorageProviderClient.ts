import type { StorageProvider } from "../../entities/speakers/StorageRepositoryConfigEntity";

export interface StorageProviderClient {
  readonly provider: StorageProvider;
  testConnection(credentials: Record<string, string>): Promise<boolean>;
}
