import { UserEntity } from "../../../domain/entities/UserEntity";
import { ValidationError } from "../../../domain/errors/ApplicationError";
import { UserRepository } from "../../../domain/repositories/UserRepository";

export interface CreateUserPayload {
  id?: string;
  name: string;
  email: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(payload: CreateUserPayload): Promise<UserEntity> {
    const user = new UserEntity(payload);

    if (user.id) {
      const existing = await this.userRepository.findById(user.id);
      if (existing) {
        throw new ValidationError(`User with id ${user.id} already exists`);
      }
    }

    return this.userRepository.create(user);
  }
}
