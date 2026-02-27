import { InscriptionEntity } from "../../domain/entities/InscriptionEntity";
import { NotFoundError } from "../../domain/errors/ApplicationError";
import { InscriptionRepository } from "../../domain/repositories/InscriptionRepository";
import { GoogleSheetsClient } from "../google/GoogleSheetsClient";
import { SheetInitializer } from "../google/SheetInitializer";
import { InscriptionMapper } from "../mappers/InscriptionMapper";

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

export class GoogleSheetsInscriptionRepository extends InscriptionRepository {
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
      expectedHeaders: InscriptionMapper.header(),
    });
  }

  async findAll(): Promise<InscriptionEntity[]> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length === 0) {
      return [];
    }

    const dataRows = rows.slice(1);

    return dataRows
      .map((row) => InscriptionMapper.toEntity(row))
      .filter(
        (inscription): inscription is InscriptionEntity =>
          inscription !== null
      );
  }

  async findById(id: string): Promise<InscriptionEntity | null> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length <= 1) {
      return null;
    }

    const dataRows = rows.slice(1);
    const row = dataRows.find((current) => current?.[0] === id);

    return row ? InscriptionMapper.toEntity(row) : null;
  }

  async findByEventAndUser(
    eventId: string,
    userId: string,
    activityId?: string
  ): Promise<InscriptionEntity | null> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length <= 1) {
      return null;
    }

    const dataRows = rows.slice(1);
    const row = dataRows.find(
      (current) =>
        current?.[1] === eventId &&
        current?.[2] === userId &&
        (activityId === undefined ? true : (current?.[3] ?? "") === activityId)
    );

    return row ? InscriptionMapper.toEntity(row) : null;
  }

  async create(
    inscriptionEntity: InscriptionEntity
  ): Promise<InscriptionEntity> {
    const values = [InscriptionMapper.toRow(inscriptionEntity)];
    await this.googleSheetsClient.appendValues(this.options.range, values);
    return inscriptionEntity;
  }

  async update(
    id: string,
    inscriptionEntity: InscriptionEntity
  ): Promise<InscriptionEntity> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length <= 1) {
      throw new NotFoundError(`Inscription with id ${id} not found`);
    }

    const dataRows = rows.slice(1);
    const rowIndex = dataRows.findIndex((row) => row?.[0] === id);

    if (rowIndex === -1) {
      throw new NotFoundError(`Inscription with id ${id} not found`);
    }

    const rowNumber = rowIndex + 2; // account for header row
    const targetRange = this.buildRowRange(rowNumber);
    const values = [InscriptionMapper.toRow(inscriptionEntity)];

    await this.googleSheetsClient.updateValues(targetRange, values);

    return inscriptionEntity;
  }

  async delete(id: string): Promise<void> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length <= 1) {
      throw new NotFoundError(`Inscription with id ${id} not found`);
    }

    const dataRows = rows.slice(1);
    const rowIndex = dataRows.findIndex((row) => row?.[0] === id);

    if (rowIndex === -1) {
      throw new NotFoundError(`Inscription with id ${id} not found`);
    }

    const rowNumber = rowIndex + 2;
    const targetRange = this.buildRowRange(rowNumber);

    await this.googleSheetsClient.clearValues(targetRange);
  }

  private buildRowRange(rowNumber: number): string {
    return `${this.sheetName}!${this.startColumn}${rowNumber}:${this.endColumn}${rowNumber}`;
  }
}

