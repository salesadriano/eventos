import { EventEntity } from "../../../domain/entities/EventEntity";
import { EventRepository } from "../../../domain/repositories/EventRepository";

export class GetEventsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(): Promise<EventEntity[]> {
    return this.eventRepository.findAll();
  }
}
