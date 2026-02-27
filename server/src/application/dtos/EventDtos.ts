import { EventEntity } from "../../domain/entities/EventEntity";

export interface EventResponseDto {
  id: string;
  title: string;
  description: string;
  date: string;
  dateInit: string;
  dateFinal: string;
  inscriptionInit: string;
  inscriptionFinal: string;
  location: string;
  appHeaderImageUrl: string;
  certificateHeaderImageUrl: string;
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
      dateInit: primitives.dateInit.toISOString(),
      dateFinal: primitives.dateFinal.toISOString(),
      inscriptionInit: primitives.inscriptionInit.toISOString(),
      inscriptionFinal: primitives.inscriptionFinal.toISOString(),
      location: primitives.location,
      appHeaderImageUrl: primitives.appHeaderImageUrl,
      certificateHeaderImageUrl: primitives.certificateHeaderImageUrl,
      createdAt: primitives.createdAt.toISOString(),
      updatedAt: primitives.updatedAt.toISOString(),
    };
  },
};
