import { SpeakerEntity } from "../../../domain/entities/speakers/SpeakerEntity";
import { ValidationError } from "../../../domain/errors/ApplicationError";
import { SpeakerRepository } from "../../../domain/repositories/speakers/SpeakerRepository";

export type CreateSpeakerPayload = {
  id?: string;
  name: string;
  email: string;
  bio?: string;
  socialLinks?: string[];
};

export class CreateSpeakerUseCase {
  constructor(private readonly speakerRepository: SpeakerRepository) {}

  async execute(payload: CreateSpeakerPayload): Promise<SpeakerEntity> {
    const existing = await this.speakerRepository.findByEmail(payload.email);

    if (existing) {
      throw new ValidationError(`Speaker with email ${payload.email} already exists`);
    }

    const speaker = SpeakerEntity.create(payload);
    return this.speakerRepository.create(speaker);
  }
}
