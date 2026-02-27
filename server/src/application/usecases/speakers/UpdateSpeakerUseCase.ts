import { SpeakerEntity } from "../../../domain/entities/speakers/SpeakerEntity";
import { NotFoundError } from "../../../domain/errors/ApplicationError";
import { SpeakerRepository } from "../../../domain/repositories/speakers/SpeakerRepository";

export type UpdateSpeakerPayload = {
  name?: string;
  email?: string;
  bio?: string;
  socialLinks?: string[];
};

export class UpdateSpeakerUseCase {
  constructor(private readonly speakerRepository: SpeakerRepository) {}

  async execute(id: string, payload: UpdateSpeakerPayload): Promise<SpeakerEntity> {
    const existing = await this.speakerRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Speaker with id ${id} not found`);
    }

    const current = existing.toPrimitives();
    const merged = new SpeakerEntity({
      ...current,
      ...payload,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date(),
    });

    return this.speakerRepository.update(id, merged);
  }
}
