import type { Event } from "../entities/Event";

export interface IEventRepository {
  findAll(): Promise<Event[]>;
  findById(id: string): Promise<Event | null>;
  create(event: Event): Promise<Event>;
  update(id: string, event: Partial<Event>): Promise<Event>;
  delete(id: string): Promise<void>;
}
