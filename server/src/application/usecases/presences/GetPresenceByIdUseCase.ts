import { PresenceEntity } from "../../../domain/entities/PresenceEntity";
import { NotFoundError } from "../../../domain/errors/ApplicationError";
import { PresenceRepository } from "../../../domain/repositories/PresenceRepository";

export class GetPresenceByIdUseCase {
  constructor(private readonly presenceRepository: PresenceRepository) {}

  async execute(id: string): Promise<PresenceEntity> {
    const presence = await this.presenceRepository.findById(id);

    if (!presence) {
      throw new NotFoundError(`Presence with id ${id} not found`);
    }

    return presence;
  }
}

