import { GoogleSheetsClient } from "./GoogleSheetsClient";

export interface SheetConfig {
  sheetName: string;
  expectedHeaders: string[];
}

export class SheetInitializer {
  constructor(private readonly googleSheetsClient: GoogleSheetsClient) {}

  async initializeSheet(config: SheetConfig): Promise<void> {
    const { sheetName, expectedHeaders } = config;

    // Check if sheet exists
    const exists = await this.googleSheetsClient.sheetExists(sheetName);

    if (!exists) {
      // Create the sheet
      console.log(`Sheet "${sheetName}" does not exist. Creating...`);
      await this.googleSheetsClient.createSheet(sheetName);
      // Set headers for new sheet
      await this.googleSheetsClient.updateSheetHeaders(
        sheetName,
        expectedHeaders
      );
      console.log(
        `Sheet "${sheetName}" created with headers: ${expectedHeaders.join(
          ", "
        )}`
      );
      return;
    }

    // Sheet exists, check headers
    const currentHeaders = await this.googleSheetsClient.getSheetHeaders(
      sheetName
    );

    if (!currentHeaders || currentHeaders.length === 0) {
      // Sheet exists but has no headers, set them
      console.log(
        `Sheet "${sheetName}" exists but has no headers. Setting headers...`
      );
      await this.googleSheetsClient.updateSheetHeaders(
        sheetName,
        expectedHeaders
      );
      console.log(
        `Headers set for "${sheetName}": ${expectedHeaders.join(", ")}`
      );
      return;
    }

    // Normalize headers (trim whitespace, handle empty strings)
    const normalizedCurrent = currentHeaders
      .map((h) => h.trim())
      .filter((h) => h.length > 0);
    const normalizedExpected = expectedHeaders
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    // Check if headers match
    const headersMatch =
      normalizedCurrent.length === normalizedExpected.length &&
      normalizedCurrent.every(
        (header, index) =>
          header.toLowerCase() === normalizedExpected[index]?.toLowerCase()
      );

    if (!headersMatch) {
      // Headers don't match, update them
      console.log(
        `Sheet "${sheetName}" headers don't match. Current: [${normalizedCurrent.join(
          ", "
        )}], Expected: [${normalizedExpected.join(", ")}]. Updating...`
      );
      // Note: This will overwrite existing headers. Data rows should remain intact
      await this.googleSheetsClient.updateSheetHeaders(
        sheetName,
        expectedHeaders
      );
      console.log(
        `Headers updated for "${sheetName}": ${expectedHeaders.join(", ")}`
      );
    } else {
      console.log(
        `Sheet "${sheetName}" is properly configured with correct headers.`
      );
    }
  }

  async initializeSheets(configs: SheetConfig[]): Promise<void> {
    await Promise.all(configs.map((config) => this.initializeSheet(config)));
  }
}
