import { EventEntity } from "../../../domain/entities/EventEntity";
import { NotFoundError } from "../../../domain/errors/ApplicationError";
import { EventRepository } from "../../../domain/repositories/EventRepository";

export interface UpdateEventPayload {
  title?: string;
  description?: string;
  date?: Date | string;
  location?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export class UpdateEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(id: string, updates: UpdateEventPayload): Promise<EventEntity> {
    const existing = await this.eventRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Event with id ${id} not found`);
    }

    const current = existing.toPrimitives();

    const merged = new EventEntity({
      ...current,
      ...updates,
      id: current.id,
      date: updates.date ?? current.date,
      createdAt: updates.createdAt ?? current.createdAt,
      updatedAt: updates.updatedAt ?? new Date(),
    });

    return this.eventRepository.update(id, merged);
  }
}
