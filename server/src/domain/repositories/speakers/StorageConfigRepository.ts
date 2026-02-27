import { StorageRepositoryConfigEntity } from "../../entities/speakers/StorageRepositoryConfigEntity";

export abstract class StorageConfigRepository {
  abstract getActive(): Promise<StorageRepositoryConfigEntity | null>;
  abstract save(config: StorageRepositoryConfigEntity): Promise<StorageRepositoryConfigEntity>;
}
