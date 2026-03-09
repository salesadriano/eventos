import type { OAuthProviderType } from "../../domain/entities/FederatedIdentityEntity";
import { FederatedIdentityEntity } from "../../domain/entities/FederatedIdentityEntity";
import { NotFoundError } from "../../domain/errors/ApplicationError";
import { FederatedIdentityRepository } from "../../domain/repositories/FederatedIdentityRepository";
import { GoogleSheetsClient } from "../google/GoogleSheetsClient";
import { SheetInitializer } from "../google/SheetInitializer";
import { FederatedIdentityMapper } from "../mappers/FederatedIdentityMapper";

interface RepositoryOptions {
  range: string;
}

export class GoogleSheetsFederatedIdentityRepository implements FederatedIdentityRepository {
  private readonly sheetName: string;

  constructor(
    private readonly googleSheetsClient: GoogleSheetsClient,
    private readonly options: RepositoryOptions,
  ) {
    const [sheetName] = options.range.split("!");
    this.sheetName = sheetName;
  }

  async initialize(): Promise<void> {
    const initializer = new SheetInitializer(this.googleSheetsClient);
    await initializer.initializeSheet({
      sheetName: this.sheetName,
      expectedHeaders: FederatedIdentityMapper.header(),
    });
  }

  async create(
    identity: FederatedIdentityEntity,
  ): Promise<FederatedIdentityEntity> {
    // Verificar constraint: provider + subject devem ser únicos
    const existing = await this.findByProviderAndSubject(
      identity.provider,
      identity.subject,
    );

    if (existing && existing.userId !== identity.userId) {
      throw new Error(
        `FederatedIdentity already exists for provider ${identity.provider} and subject ${identity.subject}`,
      );
    }

    const values = [FederatedIdentityMapper.toRow(identity)];
    await this.googleSheetsClient.appendValues(this.options.range, values);
    return identity;
  }

  async findByProviderAndSubject(
    provider: OAuthProviderType,
    subject: string,
  ): Promise<FederatedIdentityEntity | null> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length <= 1) {
      return null;
    }

    const dataRows = rows.slice(1);
    const match = dataRows.find((row) => {
      const mapped = FederatedIdentityMapper.toEntity(row);
      return mapped?.provider === provider && mapped?.subject === subject;
    });

    return match ? FederatedIdentityMapper.toEntity(match) : null;
  }

  async findByUserIdAndProvider(
    userId: string,
    provider: OAuthProviderType,
  ): Promise<FederatedIdentityEntity | null> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length <= 1) {
      return null;
    }

    const dataRows = rows.slice(1);
    const match = dataRows.find((row) => {
      const mapped = FederatedIdentityMapper.toEntity(row);
      return mapped?.userId === userId && mapped?.provider === provider;
    });

    return match ? FederatedIdentityMapper.toEntity(match) : null;
  }

  async findAllByUserId(userId: string): Promise<FederatedIdentityEntity[]> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length <= 1) {
      return [];
    }

    const dataRows = rows.slice(1);
    return dataRows
      .map((row) => FederatedIdentityMapper.toEntity(row))
      .filter(
        (identity): identity is FederatedIdentityEntity =>
          identity !== null && identity.userId === userId,
      );
  }

  async delete(id: string): Promise<void> {
    const rows = await this.googleSheetsClient.getValues(this.options.range);

    if (!rows || rows.length <= 1) {
      throw new NotFoundError(`FederatedIdentity with id ${id} not found`);
    }

    const dataRows = rows.slice(1);
    const rowIndex = dataRows.findIndex((row) => row?.[0] === id);

    if (rowIndex === -1) {
      throw new NotFoundError(`FederatedIdentity with id ${id} not found`);
    }

    const rowNumber = rowIndex + 2;
    const targetRange = `${this.sheetName}!A${rowNumber}:H${rowNumber}`;

    // Limpar linha inteira
    await this.googleSheetsClient.updateValues(targetRange, [
      ["", "", "", "", "", "", "", ""],
    ]);
  }
}
