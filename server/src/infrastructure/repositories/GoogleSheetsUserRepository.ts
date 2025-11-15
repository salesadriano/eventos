import { UserEntity } from "../../domain/entities/UserEntity";
import { NotFoundError } from "../../domain/errors/ApplicationError";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { GoogleSheetsClient } from "../google/GoogleSheetsClient";
import { UserMapper } from "../mappers/UserMapper";

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

export class GoogleSheetsUserRepository extends UserRepository {
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

  async findAll(): Promise<UserEntity[]> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length === 0) {
      return [];
    }

    const dataRows = rows.slice(1);

    return dataRows
      .map((row) => UserMapper.toEntity(row))
      .filter((user): user is UserEntity => user !== null);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length <= 1) {
      return null;
    }

    const dataRows = rows.slice(1);
    const row = dataRows.find((current) => current?.[0] === id);

    return row ? UserMapper.toEntity(row) : null;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const values = [UserMapper.toRow(user)];
    await this.googleSheetsClient.appendValues(this.options.range, values);
    return user;
  }

  async update(id: string, user: UserEntity): Promise<UserEntity> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length <= 1) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    const dataRows = rows.slice(1);
    const rowIndex = dataRows.findIndex((row) => row?.[0] === id);

    if (rowIndex === -1) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    const rowNumber = rowIndex + 2;
    const targetRange = this.buildRowRange(rowNumber);
    const values = [UserMapper.toRow(user)];

    await this.googleSheetsClient.updateValues(targetRange, values);

    return user;
  }

  async delete(id: string): Promise<void> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length <= 1) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    const dataRows = rows.slice(1);
    const rowIndex = dataRows.findIndex((row) => row?.[0] === id);

    if (rowIndex === -1) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    const rowNumber = rowIndex + 2;
    const targetRange = this.buildRowRange(rowNumber);

    await this.googleSheetsClient.clearValues(targetRange);
  }

  private buildRowRange(rowNumber: number): string {
    return `${this.sheetName}!${this.startColumn}${rowNumber}:${this.endColumn}${rowNumber}`;
  }
}
