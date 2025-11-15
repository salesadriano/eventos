import {
  type PaginatedResponse,
  type PaginationParams,
  paginateArray,
} from "../../dtos/PaginationDtos";
import { InscriptionEntity } from "../../../domain/entities/InscriptionEntity";
import { InscriptionRepository } from "../../../domain/repositories/InscriptionRepository";

export class GetInscriptionsUseCase {
  constructor(
    private readonly inscriptionRepository: InscriptionRepository
  ) {}

  async execute(
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<InscriptionEntity>> {
    const allInscriptions = await this.inscriptionRepository.findAll();

    if (!pagination) {
      // Return all inscriptions with default pagination metadata
      const { results, meta } = paginateArray(
        allInscriptions,
        1,
        allInscriptions.length
      );
      return { results, meta };
    }

    return paginateArray(allInscriptions, pagination.page, pagination.limit);
  }

  async executeAll(): Promise<InscriptionEntity[]> {
    return this.inscriptionRepository.findAll();
  }
}

