import { InscriptionEntity } from "../../domain/entities/InscriptionEntity";
import type { InscriptionStatus } from "../../domain/entities/InscriptionEntity";

export interface InscriptionResponseDto {
  id: string;
  eventId: string;
  userId: string;
  activityId: string;
  status: InscriptionStatus;
  createdAt: string;
  updatedAt: string;
}

export const InscriptionDtoMapper = {
  toResponse(
    inscriptionEntity: InscriptionEntity
  ): InscriptionResponseDto {
    const primitives = inscriptionEntity.toPrimitives();
    return {
      id: primitives.id,
      eventId: primitives.eventId,
      userId: primitives.userId,
      activityId: primitives.activityId,
      status: primitives.status,
      createdAt: primitives.createdAt.toISOString(),
      updatedAt: primitives.updatedAt.toISOString(),
    };
  },
};

