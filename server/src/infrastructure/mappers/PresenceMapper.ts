import { PresenceEntity } from "../../domain/entities/PresenceEntity";

const HEADER = ["id", "eventId", "userId", "presentAt", "createdAt"];

const ensureValue = (value: string | undefined, fallback = ""): string =>
  value !== undefined && value !== null ? value : fallback;

export const PresenceMapper = {
  header(): string[] {
    return [...HEADER];
  },

  toEntity(row: string[]): PresenceEntity | null {
    if (!row || row.length === 0 || !row[0]) {
      return null;
    }

    return new PresenceEntity({
      id: ensureValue(row[0]),
      eventId: ensureValue(row[1]),
      userId: ensureValue(row[2]),
      presentAt: ensureValue(row[3], new Date().toISOString()),
      createdAt: ensureValue(row[4], new Date().toISOString()),
    });
  },

  toRow(presenceEntity: PresenceEntity): string[] {
    const { id, eventId, userId, presentAt, createdAt } =
      presenceEntity.toPrimitives();

    return [
      id,
      eventId,
      userId,
      presentAt.toISOString(),
      createdAt.toISOString(),
    ];
  },
};

