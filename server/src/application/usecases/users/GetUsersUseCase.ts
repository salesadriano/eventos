import {
  type PaginatedResponse,
  type PaginationParams,
  paginateArray,
} from "../../dtos/PaginationDtos";
import { UserEntity } from "../../../domain/entities/UserEntity";
import { UserRepository } from "../../../domain/repositories/UserRepository";

export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<UserEntity>> {
    const allUsers = await this.userRepository.findAll();

    if (!pagination) {
      // Return all users with default pagination metadata
      const { results, meta } = paginateArray(allUsers, 1, allUsers.length);
      return { results, meta };
    }

    return paginateArray(allUsers, pagination.page, pagination.limit);
  }

  async executeAll(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }
}
