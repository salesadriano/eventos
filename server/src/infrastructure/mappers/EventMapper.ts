import { EventEntity } from "../../domain/entities/EventEntity";

const HEADER = [
  "id",
  "title",
  "description",
  "dateInit",
  "dateFinal",
  "inscriptionInit",
  "inscriptionFinal",
  "location",
  "createdAt",
  "updatedAt",
];

const ensureValue = (value: string | undefined, fallback = ""): string =>
  value !== undefined && value !== null ? value : fallback;

export const EventMapper = {
  header(): string[] {
    return [...HEADER];
  },

  toEntity(row: string[]): EventEntity | null {
    if (!row || row.length === 0 || !row[0]) {
      return null;
    }

    return new EventEntity({
      id: ensureValue(row[0]),
      title: ensureValue(row[1]),
      description: ensureValue(row[2]),
      dateInit: ensureValue(row[3], new Date().toISOString()),
      dateFinal: ensureValue(row[4], new Date().toISOString()),
      inscriptionInit: ensureValue(row[5], new Date().toISOString()),
      inscriptionFinal: ensureValue(row[6], new Date().toISOString()),
      location: ensureValue(row[7]),
      createdAt: ensureValue(row[8], new Date().toISOString()),
      updatedAt: ensureValue(row[9], new Date().toISOString()),
    });
  },

  toRow(eventEntity: EventEntity): string[] {
    const {
      id,
      title,
      description,
      dateInit,
      dateFinal,
      inscriptionInit,
      inscriptionFinal,
      location,
      createdAt,
      updatedAt,
    } = eventEntity.toPrimitives();

    return [
      id,
      title,
      description,
      dateInit.toISOString(),
      dateFinal.toISOString(),
      inscriptionInit.toISOString(),
      inscriptionFinal.toISOString(),
      location,
      createdAt.toISOString(),
      updatedAt.toISOString(),
    ];
  },
};
