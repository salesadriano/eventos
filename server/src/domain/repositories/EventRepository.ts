import { EventEntity } from "../entities/EventEntity";

export abstract class EventRepository {
  abstract findAll(): Promise<EventEntity[]>;
  abstract findById(id: string): Promise<EventEntity | null>;
  abstract create(eventEntity: EventEntity): Promise<EventEntity>;
  abstract update(id: string, eventEntity: EventEntity): Promise<EventEntity>;
  abstract delete(id: string): Promise<void>;
}
