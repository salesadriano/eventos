import type { Event } from "../../domain/entities/Event";
import { EventEntity } from "../../domain/entities/Event";
import type { IEventRepository } from "../../domain/repositories/IEventRepository";
import type { IGoogleSheetsClient } from "../google-sheets/IGoogleSheetsClient";
import type { IGoogleSheetsConfig } from "../../domain/repositories/IGoogleSheetsConfig";

export class GoogleSheetsEventRepository implements IEventRepository {

  constructor(
    private readonly sheetsClient: IGoogleSheetsClient,
    private readonly config: IGoogleSheetsConfig
  ) {}

  async findAll(): Promise<Event[]> {
    const rows = await this.sheetsClient.read(this.config.range);

    if (rows.length === 0) {
      return [];
    }

    // Skip header row
    const dataRows = rows.slice(1);

    return dataRows
      .filter((row) => row.length > 0 && row[0]) // Filter empty rows
      .map((row) => EventEntity.fromRow(row));
  }

  async findById(id: string): Promise<Event | null> {
    const events = await this.findAll();
    return events.find((event) => event.id === id) || null;
  }

  async create(event: Event): Promise<Event> {
    const eventEntity = event instanceof EventEntity ? event : new EventEntity(
      event.id,
      event.title,
      event.description,
      event.date,
      event.location,
      event.createdAt,
      event.updatedAt
    );

    await this.sheetsClient.append([eventEntity.toRow()]);
    return eventEntity;
  }

  async update(id: string, event: Partial<Event>): Promise<Event> {
    const rows = await this.sheetsClient.read(this.config.range);

    if (rows.length <= 1) {
      throw new Error(`Event with ID ${id} not found`);
    }

    // Find the row index (skip header)
    const dataRows = rows.slice(1);
    const rowIndex = dataRows.findIndex((row) => row[0] === id);

    if (rowIndex === -1) {
      throw new Error(`Event with ID ${id} not found`);
    }

    // Get existing event
    const existingEvent = EventEntity.fromRow(dataRows[rowIndex]);

    // Merge with updates
    const updatedEvent = new EventEntity(
      existingEvent.id,
      event.title ?? existingEvent.title,
      event.description ?? existingEvent.description,
      event.date ?? existingEvent.date,
      event.location ?? existingEvent.location,
      existingEvent.createdAt,
      new Date()
    );

    // Update the row (rowIndex + 2 because: 1 for header, 1 for 0-based index)
    const range = `${this.config.range.split("!")[0]}!A${rowIndex + 2}:G${rowIndex + 2}`;
    await this.sheetsClient.update(range, [updatedEvent.toRow()]);

    return updatedEvent;
  }

  async delete(id: string): Promise<void> {
    const rows = await this.sheetsClient.read(this.config.range);

    if (rows.length <= 1) {
      throw new Error(`Event with ID ${id} not found`);
    }

    const dataRows = rows.slice(1);
    const rowIndex = dataRows.findIndex((row) => row[0] === id);

    if (rowIndex === -1) {
      throw new Error(`Event with ID ${id} not found`);
    }

    // Delete by clearing the row (rowIndex + 2)
    const range = `${this.config.range.split("!")[0]}!A${rowIndex + 2}:G${rowIndex + 2}`;
    await this.sheetsClient.delete(range);
  }
}
