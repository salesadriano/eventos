import { UserEntity } from "../../../domain/entities/UserEntity";
import { NotFoundError } from "../../../domain/errors/ApplicationError";
import { UserRepository } from "../../../domain/repositories/UserRepository";

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    return user;
  }
}
