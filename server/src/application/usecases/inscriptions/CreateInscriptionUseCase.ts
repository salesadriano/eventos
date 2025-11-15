import { InscriptionEntity } from "../../../domain/entities/InscriptionEntity";
import type { InscriptionStatus } from "../../../domain/entities/InscriptionEntity";
import { ValidationError } from "../../../domain/errors/ApplicationError";
import { InscriptionRepository } from "../../../domain/repositories/InscriptionRepository";

export interface CreateInscriptionPayload {
  id?: string;
  eventId: string;
  userId: string;
  status?: InscriptionStatus;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export class CreateInscriptionUseCase {
  constructor(
    private readonly inscriptionRepository: InscriptionRepository
  ) {}

  async execute(
    payload: CreateInscriptionPayload
  ): Promise<InscriptionEntity> {
    // Check if inscription already exists for this event and user
    const existing = await this.inscriptionRepository.findByEventAndUser(
      payload.eventId,
      payload.userId
    );

    if (existing) {
      throw new ValidationError(
        `Inscription already exists for event ${payload.eventId} and user ${payload.userId}`
      );
    }

    const inscription = new InscriptionEntity(payload);

    if (inscription.id) {
      const alreadyExists = await this.inscriptionRepository.findById(
        inscription.id
      );

      if (alreadyExists) {
        throw new ValidationError(
          `Inscription with id ${inscription.id} already exists`
        );
      }
    }

    return this.inscriptionRepository.create(inscription);
  }
}

