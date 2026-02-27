import { NotFoundError } from "../../../domain/errors/ApplicationError";
import { EventRepository } from "../../../domain/repositories/EventRepository";

export class DeleteEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.eventRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Event with id ${id} not found`);
    }

    await this.eventRepository.delete(id);
  }
}
