import type { Event } from "../../domain/entities/Event";
import { EventEntity } from "../../domain/entities/Event";
import type { IEventRepository } from "../../domain/repositories/IEventRepository";

export class EventService {
  constructor(private readonly eventRepository: IEventRepository) {}

  async getAllEvents(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }

  async getEventById(id: string): Promise<Event | null> {
    if (!id) {
      throw new Error("Event ID is required");
    }
    return this.eventRepository.findById(id);
  }

  async createEvent(data: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<Event> {
    const event = EventEntity.create(data);
    return this.eventRepository.create(event);
  }

  async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
    if (!id) {
      throw new Error("Event ID is required");
    }

    const existingEvent = await this.eventRepository.findById(id);
    if (!existingEvent) {
      throw new Error(`Event with ID ${id} not found`);
    }

    const updatedEvent: Event = {
      ...existingEvent,
      ...data,
      updatedAt: new Date(),
    };

    return this.eventRepository.update(id, updatedEvent);
  }

  async deleteEvent(id: string): Promise<void> {
    if (!id) {
      throw new Error("Event ID is required");
    }

    const existingEvent = await this.eventRepository.findById(id);
    if (!existingEvent) {
      throw new Error(`Event with ID ${id} not found`);
    }

    return this.eventRepository.delete(id);
  }
}
