import { InscriptionEntity } from "../../../domain/entities/InscriptionEntity";
import type { InscriptionStatus } from "../../../domain/entities/InscriptionEntity";
import { NotFoundError } from "../../../domain/errors/ApplicationError";
import { InscriptionRepository } from "../../../domain/repositories/InscriptionRepository";

export interface UpdateInscriptionPayload {
  eventId?: string;
  userId?: string;
  status?: InscriptionStatus;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export class UpdateInscriptionUseCase {
  constructor(
    private readonly inscriptionRepository: InscriptionRepository
  ) {}

  async execute(
    id: string,
    updates: UpdateInscriptionPayload
  ): Promise<InscriptionEntity> {
    const existing = await this.inscriptionRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Inscription with id ${id} not found`);
    }

    const current = existing.toPrimitives();

    const merged = new InscriptionEntity({
      ...current,
      ...updates,
      id: current.id,
      createdAt: updates.createdAt ?? current.createdAt,
      updatedAt: updates.updatedAt ?? new Date(),
    });

    return this.inscriptionRepository.update(id, merged);
  }
}

