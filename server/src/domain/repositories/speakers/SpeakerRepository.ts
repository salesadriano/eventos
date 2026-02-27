import { SpeakerEntity } from "../../entities/speakers/SpeakerEntity";

export abstract class SpeakerRepository {
  abstract findById(id: string): Promise<SpeakerEntity | null>;
  abstract findByEmail(email: string): Promise<SpeakerEntity | null>;
  abstract create(speaker: SpeakerEntity): Promise<SpeakerEntity>;
  abstract update(id: string, speaker: SpeakerEntity): Promise<SpeakerEntity>;
}
