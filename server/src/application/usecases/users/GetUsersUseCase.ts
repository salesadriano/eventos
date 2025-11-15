import { UserEntity } from "../../../domain/entities/UserEntity";
import { UserRepository } from "../../../domain/repositories/UserRepository";

export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }
}
