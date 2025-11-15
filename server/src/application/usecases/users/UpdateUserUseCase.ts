import { UserEntity } from "../../../domain/entities/UserEntity";
import { NotFoundError } from "../../../domain/errors/ApplicationError";
import { UserRepository } from "../../../domain/repositories/UserRepository";

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, updates: UpdateUserPayload): Promise<UserEntity> {
    const existing = await this.userRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    const current = existing.toPrimitives();

    const merged = new UserEntity({
      ...current,
      ...updates,
      id: current.id,
      createdAt: updates.createdAt ?? current.createdAt,
      updatedAt: updates.updatedAt ?? new Date(),
    });

    return this.userRepository.update(id, merged);
  }
}
