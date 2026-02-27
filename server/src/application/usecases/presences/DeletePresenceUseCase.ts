import { NotFoundError } from "../../../domain/errors/ApplicationError";
import { PresenceRepository } from "../../../domain/repositories/PresenceRepository";

export class DeletePresenceUseCase {
  constructor(private readonly presenceRepository: PresenceRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.presenceRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Presence with id ${id} not found`);
    }

    await this.presenceRepository.delete(id);
  }
}

