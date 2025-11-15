import { EventEntity } from "../../../domain/entities/EventEntity";
import { ValidationError } from "../../../domain/errors/ApplicationError";
import { EventRepository } from "../../../domain/repositories/EventRepository";

export interface CreateEventPayload {
  id?: string;
  title: string;
  description?: string;
  date: Date | string;
  location?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export class CreateEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(payload: CreateEventPayload): Promise<EventEntity> {
    const event = new EventEntity(payload);

    if (event.id) {
      const alreadyExists = await this.eventRepository.findById(event.id);

      if (alreadyExists) {
        throw new ValidationError(`Event with id ${event.id} already exists`);
      }
    }

    return this.eventRepository.create(event);
  }
}
