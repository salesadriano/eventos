import { ValidationError } from "../../errors/ApplicationError";

export type StorageProvider = "local" | "drive" | "s3";

export interface StorageRepositoryConfigCreateProps {
  provider: StorageProvider;
  active: boolean;
  credentials: Record<string, string>;
}

export class StorageRepositoryConfigEntity {
  public readonly provider: StorageProvider;
  public readonly active: boolean;
  public readonly credentials: Record<string, string>;

  constructor({
    provider,
    active,
    credentials,
  }: StorageRepositoryConfigCreateProps) {
    this.provider = provider;
    this.active = active;
    this.credentials = credentials;

    this.validate();
  }

  private validate(): void {
    if (!this.provider) {
      throw new ValidationError("Storage provider is required");
    }

    if (!this.credentials || Object.keys(this.credentials).length === 0) {
      throw new ValidationError("Storage credentials are required");
    }
  }
}
