import { NotFoundError } from "../../../domain/errors/ApplicationError";
import { UserRepository } from "../../../domain/repositories/UserRepository";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.userRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    await this.userRepository.delete(id);
  }
}
