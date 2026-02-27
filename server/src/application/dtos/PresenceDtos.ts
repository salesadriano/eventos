import { PresenceEntity } from "../../domain/entities/PresenceEntity";

export interface PresenceResponseDto {
  id: string;
  eventId: string;
  userId: string;
  presentAt: string;
  createdAt: string;
}

export const PresenceDtoMapper = {
  toResponse(presenceEntity: PresenceEntity): PresenceResponseDto {
    const primitives = presenceEntity.toPrimitives();
    return {
      id: primitives.id,
      eventId: primitives.eventId,
      userId: primitives.userId,
      presentAt: primitives.presentAt.toISOString(),
      createdAt: primitives.createdAt.toISOString(),
    };
  },
};

