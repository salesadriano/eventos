import {
  type PaginatedResponse,
  type PaginationParams,
  paginateArray,
} from "../../dtos/PaginationDtos";
import { EventEntity } from "../../../domain/entities/EventEntity";
import { EventRepository } from "../../../domain/repositories/EventRepository";

export class GetEventsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<EventEntity>> {
    const allEvents = await this.eventRepository.findAll();

    if (!pagination) {
      // Return all events with default pagination metadata
      const { results, meta } = paginateArray(allEvents, 1, allEvents.length);
      return { results, meta };
    }

    return paginateArray(allEvents, pagination.page, pagination.limit);
  }

  async executeAll(): Promise<EventEntity[]> {
    return this.eventRepository.findAll();
  }
}
