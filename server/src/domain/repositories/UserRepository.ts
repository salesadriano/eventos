import { UserEntity } from "../entities/UserEntity";

export abstract class UserRepository {
  abstract findAll(): Promise<UserEntity[]>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract create(userEntity: UserEntity): Promise<UserEntity>;
  abstract update(id: string, userEntity: UserEntity): Promise<UserEntity>;
  abstract delete(id: string): Promise<void>;
}
