import { PresenceEntity } from "../entities/PresenceEntity";

export abstract class PresenceRepository {
  abstract findAll(): Promise<PresenceEntity[]>;
  abstract findById(id: string): Promise<PresenceEntity | null>;
  abstract findByEvent(eventId: string): Promise<PresenceEntity[]>;
  abstract create(presenceEntity: PresenceEntity): Promise<PresenceEntity>;
  abstract delete(id: string): Promise<void>;
}
