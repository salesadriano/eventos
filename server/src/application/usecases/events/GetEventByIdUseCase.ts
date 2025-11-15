import { EventEntity } from "../../../domain/entities/EventEntity";
import { NotFoundError } from "../../../domain/errors/ApplicationError";
import { EventRepository } from "../../../domain/repositories/EventRepository";

export class GetEventByIdUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(id: string): Promise<EventEntity> {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new NotFoundError(`Event with id ${id} not found`);
    }

    return event;
  }
}
