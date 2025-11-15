import { EventEntity } from "../../domain/entities/EventEntity";
import { NotFoundError } from "../../domain/errors/ApplicationError";
import { EventRepository } from "../../domain/repositories/EventRepository";
import { GoogleSheetsClient } from "../google/GoogleSheetsClient";
import { SheetInitializer } from "../google/SheetInitializer";
import { EventMapper } from "../mappers/EventMapper";

interface RepositoryOptions {
  range: string;
}

const columnFromCell = (cell: string | undefined): string => {
  if (!cell) {
    return "A";
  }

  const match = cell.match(/[A-Z]+/i);
  return match ? match[0].toUpperCase() : "A";
};

export class GoogleSheetsEventRepository extends EventRepository {
  private readonly sheetName: string;
  private readonly startColumn: string;
  private readonly endColumn: string;

  constructor(
    private readonly googleSheetsClient: GoogleSheetsClient,
    private readonly options: RepositoryOptions
  ) {
    super();

    const [sheetName, cellRange = "A:G"] = options.range.split("!");
    this.sheetName = sheetName;

    const [startCell, endCell] = cellRange.split(":");
    this.startColumn = columnFromCell(startCell);
    this.endColumn = columnFromCell(endCell ?? startCell);
  }

  async initialize(): Promise<void> {
    const initializer = new SheetInitializer(this.googleSheetsClient);
    await initializer.initializeSheet({
      sheetName: this.sheetName,
      expectedHeaders: EventMapper.header(),
    });
  }

  async findAll(): Promise<EventEntity[]> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length === 0) {
      return [];
    }

    const dataRows = rows.slice(1);

    return dataRows
      .map((row) => EventMapper.toEntity(row))
      .filter((event): event is EventEntity => event !== null);
  }

  async findById(id: string): Promise<EventEntity | null> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length <= 1) {
      return null;
    }

    const dataRows = rows.slice(1);
    const row = dataRows.find((current) => current?.[0] === id);

    return row ? EventMapper.toEntity(row) : null;
  }

  async create(eventEntity: EventEntity): Promise<EventEntity> {
    const values = [EventMapper.toRow(eventEntity)];
    await this.googleSheetsClient.appendValues(this.options.range, values);
    return eventEntity;
  }

  async update(id: string, eventEntity: EventEntity): Promise<EventEntity> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length <= 1) {
      throw new NotFoundError(`Event with id ${id} not found`);
    }

    const dataRows = rows.slice(1);
    const rowIndex = dataRows.findIndex((row) => row?.[0] === id);

    if (rowIndex === -1) {
      throw new NotFoundError(`Event with id ${id} not found`);
    }

    const rowNumber = rowIndex + 2; // account for header row
    const targetRange = this.buildRowRange(rowNumber);
    const values = [EventMapper.toRow(eventEntity)];

    await this.googleSheetsClient.updateValues(targetRange, values);

    return eventEntity;
  }

  async delete(id: string): Promise<void> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length <= 1) {
      throw new NotFoundError(`Event with id ${id} not found`);
    }

    const dataRows = rows.slice(1);
    const rowIndex = dataRows.findIndex((row) => row?.[0] === id);

    if (rowIndex === -1) {
      throw new NotFoundError(`Event with id ${id} not found`);
    }

    const rowNumber = rowIndex + 2;
    const targetRange = this.buildRowRange(rowNumber);

    await this.googleSheetsClient.clearValues(targetRange);
  }

  private buildRowRange(rowNumber: number): string {
    return `${this.sheetName}!${this.startColumn}${rowNumber}:${this.endColumn}${rowNumber}`;
  }
}
