import {
  type PaginatedResponse,
  type PaginationParams,
  paginateArray,
} from "../../dtos/PaginationDtos";
import { PresenceEntity } from "../../../domain/entities/PresenceEntity";
import { PresenceRepository } from "../../../domain/repositories/PresenceRepository";

export class GetPresencesUseCase {
  constructor(private readonly presenceRepository: PresenceRepository) {}

  async execute(
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<PresenceEntity>> {
    const allPresences = await this.presenceRepository.findAll();

    if (!pagination) {
      // Return all presences with default pagination metadata
      const { results, meta } = paginateArray(
        allPresences,
        1,
        allPresences.length
      );
      return { results, meta };
    }

    return paginateArray(allPresences, pagination.page, pagination.limit);
  }

  async executeAll(): Promise<PresenceEntity[]> {
    return this.presenceRepository.findAll();
  }
}

