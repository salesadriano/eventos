import { PresenceEntity } from "../../domain/entities/PresenceEntity";
import { NotFoundError } from "../../domain/errors/ApplicationError";
import { PresenceRepository } from "../../domain/repositories/PresenceRepository";
import { GoogleSheetsClient } from "../google/GoogleSheetsClient";
import { SheetInitializer } from "../google/SheetInitializer";
import { PresenceMapper } from "../mappers/PresenceMapper";

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

export class GoogleSheetsPresenceRepository extends PresenceRepository {
  private readonly sheetName: string;
  private readonly startColumn: string;
  private readonly endColumn: string;

  constructor(
    private readonly googleSheetsClient: GoogleSheetsClient,
    private readonly options: RepositoryOptions
  ) {
    super();

    const [sheetName, cellRange = "A:E"] = options.range.split("!");
    this.sheetName = sheetName;

    const [startCell, endCell] = cellRange.split(":");
    this.startColumn = columnFromCell(startCell);
    this.endColumn = columnFromCell(endCell ?? startCell);
  }

  async initialize(): Promise<void> {
    const initializer = new SheetInitializer(this.googleSheetsClient);
    await initializer.initializeSheet({
      sheetName: this.sheetName,
      expectedHeaders: PresenceMapper.header(),
    });
  }

  async findAll(): Promise<PresenceEntity[]> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length === 0) {
      return [];
    }

    const dataRows = rows.slice(1);

    return dataRows
      .map((row) => PresenceMapper.toEntity(row))
      .filter((presence): presence is PresenceEntity => presence !== null);
  }

  async findById(id: string): Promise<PresenceEntity | null> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length <= 1) {
      return null;
    }

    const dataRows = rows.slice(1);
    const row = dataRows.find((current) => current?.[0] === id);

    return row ? PresenceMapper.toEntity(row) : null;
  }

  async findByEvent(eventId: string): Promise<PresenceEntity[]> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length <= 1) {
      return [];
    }

    const dataRows = rows.slice(1);
    const matchingRows = dataRows.filter((row) => row?.[1] === eventId);

    return matchingRows
      .map((row) => PresenceMapper.toEntity(row))
      .filter((presence): presence is PresenceEntity => presence !== null);
  }

  async create(presenceEntity: PresenceEntity): Promise<PresenceEntity> {
    const values = [PresenceMapper.toRow(presenceEntity)];
    await this.googleSheetsClient.appendValues(this.options.range, values);
    return presenceEntity;
  }

  async delete(id: string): Promise<void> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length <= 1) {
      throw new NotFoundError(`Presence with id ${id} not found`);
    }

    const dataRows = rows.slice(1);
    const rowIndex = dataRows.findIndex((row) => row?.[0] === id);

    if (rowIndex === -1) {
      throw new NotFoundError(`Presence with id ${id} not found`);
    }

    const rowNumber = rowIndex + 2;
    const targetRange = this.buildRowRange(rowNumber);

    await this.googleSheetsClient.clearValues(targetRange);
  }

  private buildRowRange(rowNumber: number): string {
    return `${this.sheetName}!${this.startColumn}${rowNumber}:${this.endColumn}${rowNumber}`;
  }
}

