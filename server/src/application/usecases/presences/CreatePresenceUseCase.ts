import { PresenceEntity } from "../../../domain/entities/PresenceEntity";
import { ValidationError } from "../../../domain/errors/ApplicationError";
import { PresenceRepository } from "../../../domain/repositories/PresenceRepository";

export interface CreatePresencePayload {
  id?: string;
  eventId: string;
  userId: string;
  presentAt?: Date | string;
  createdAt?: Date | string;
}

export class CreatePresenceUseCase {
  constructor(private readonly presenceRepository: PresenceRepository) {}

  async execute(payload: CreatePresencePayload): Promise<PresenceEntity> {
    // Check if presence already exists for this event and user
    const allPresences = await this.presenceRepository.findByEvent(
      payload.eventId
    );
    const existing = allPresences.find((p) => p.userId === payload.userId);

    if (existing) {
      throw new ValidationError(
        `Presence already exists for event ${payload.eventId} and user ${payload.userId}`
      );
    }

    const presence = new PresenceEntity(payload);

    if (presence.id) {
      const alreadyExists = await this.presenceRepository.findById(
        presence.id
      );

      if (alreadyExists) {
        throw new ValidationError(
          `Presence with id ${presence.id} already exists`
        );
      }
    }

    return this.presenceRepository.create(presence);
  }
}

