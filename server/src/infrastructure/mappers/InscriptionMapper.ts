import { InscriptionEntity } from "../../domain/entities/InscriptionEntity";

const HEADER = [
  "id",
  "eventId",
  "userId",
  "activityId",
  "status",
  "createdAt",
  "updatedAt",
];

const ensureValue = (value: string | undefined, fallback = ""): string =>
  value !== undefined && value !== null ? value : fallback;

export const InscriptionMapper = {
  header(): string[] {
    return [...HEADER];
  },

  toEntity(row: string[]): InscriptionEntity | null {
    if (!row || row.length === 0 || !row[0]) {
      return null;
    }

    return new InscriptionEntity({
      id: ensureValue(row[0]),
      eventId: ensureValue(row[1]),
      userId: ensureValue(row[2]),
      activityId: ensureValue(row[3]),
      status: (ensureValue(row[4]) || "pending") as
        | "pending"
        | "confirmed"
        | "cancelled",
      createdAt: ensureValue(row[5], new Date().toISOString()),
      updatedAt: ensureValue(row[6], new Date().toISOString()),
    });
  },

  toRow(inscriptionEntity: InscriptionEntity): string[] {
    const {
      id,
      eventId,
      userId,
      activityId,
      status,
      createdAt,
      updatedAt,
    } = inscriptionEntity.toPrimitives();

    return [
      id,
      eventId,
      userId,
      activityId,
      status,
      createdAt.toISOString(),
      updatedAt.toISOString(),
    ];
  },
};

