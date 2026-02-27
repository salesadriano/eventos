import { EventEntity } from "../../domain/entities/EventEntity";

export interface EventResponseDto {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export const EventDtoMapper = {
  toResponse(eventEntity: EventEntity): EventResponseDto {
    const primitives = eventEntity.toPrimitives();
    return {
      id: primitives.id,
      title: primitives.title,
      description: primitives.description,
      date: primitives.date.toISOString(),
      location: primitives.location,
      createdAt: primitives.createdAt.toISOString(),
      updatedAt: primitives.updatedAt.toISOString(),
    };
  },
};
