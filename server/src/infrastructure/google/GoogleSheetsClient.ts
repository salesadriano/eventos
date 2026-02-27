import { google, sheets_v4 } from "googleapis";

export interface GoogleSheetsClientConfig {
  spreadsheetId: string;
  serviceAccount: {
    email: string;
    privateKey: string;
    scopes: string[];
  };
}

export class GoogleSheetsClient {
  private readonly sheetsApi: sheets_v4.Sheets;

  constructor(private readonly config: GoogleSheetsClientConfig) {
    const authClient = new google.auth.JWT({
      email: config.serviceAccount.email,
      key: config.serviceAccount.privateKey,
      scopes: config.serviceAccount.scopes,
    });

    this.sheetsApi = google.sheets({ version: "v4", auth: authClient });
  }

  async getValues(range: string): Promise<string[][]> {
    const response = await this.sheetsApi.spreadsheets.values.get({
      spreadsheetId: this.config.spreadsheetId,
      range,
    });

    return response.data.values ?? [];
  }

  async appendValues(range: string, values: string[][]): Promise<void> {
    await this.sheetsApi.spreadsheets.values.append({
      spreadsheetId: this.config.spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });
  }

  async updateValues(range: string, values: string[][]): Promise<void> {
    await this.sheetsApi.spreadsheets.values.update({
      spreadsheetId: this.config.spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });
  }

  async clearValues(range: string): Promise<void> {
    await this.sheetsApi.spreadsheets.values.clear({
      spreadsheetId: this.config.spreadsheetId,
      range,
    });
  }

  async sheetExists(sheetName: string): Promise<boolean> {
    try {
      const response = await this.sheetsApi.spreadsheets.get({
        spreadsheetId: this.config.spreadsheetId,
      });

      const sheets = response.data.sheets || [];
      return sheets.some((sheet) => sheet.properties?.title === sheetName);
    } catch (error) {
      throw new Error(
        `Failed to check if sheet exists: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async createSheet(sheetName: string): Promise<void> {
    try {
      await this.sheetsApi.spreadsheets.batchUpdate({
        spreadsheetId: this.config.spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      });
    } catch (error) {
      throw new Error(
        `Failed to create sheet: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async getSheetHeaders(sheetName: string): Promise<string[] | null> {
    try {
      const range = `${sheetName}!1:1`;
      const response = await this.sheetsApi.spreadsheets.values.get({
        spreadsheetId: this.config.spreadsheetId,
        range,
      });

      const values = response.data.values;
      if (!values || values.length === 0) {
        return null;
      }

      return values[0] as string[];
    } catch (error) {
      console.error(
        `Failed to get sheet headers: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return null;
    }
  }

  async updateSheetHeaders(
    sheetName: string,
    expectedHeaders: string[]
  ): Promise<void> {
    try {
      // Get spreadsheet and sheet information
      const spreadsheet = await this.sheetsApi.spreadsheets.get({
        spreadsheetId: this.config.spreadsheetId,
      });

      const sheet = spreadsheet.data.sheets?.find(
        (s) => s.properties?.title === sheetName
      );

      if (!sheet?.properties) {
        throw new Error(`Sheet "${sheetName}" not found`);
      }

      const sheetId = sheet.properties.sheetId;
      if (sheetId === undefined) {
        throw new Error(`Sheet "${sheetName}" has no sheetId`);
      }

      // Get current headers
      const currentHeaders = await this.getSheetHeaders(sheetName);
      const currentHeadersArray = currentHeaders || [];

      // Normalize headers for comparison (case-insensitive, trimmed)
      const normalizeHeader = (h: string) => h.trim().toLowerCase();
      const normalizedExpected = expectedHeaders.map(normalizeHeader);
      const normalizedCurrent = currentHeadersArray.map(normalizeHeader);

      // Create a map of expected header positions
      const expectedHeaderMap = new Map<string, number>();
      expectedHeaders.forEach((header, index) => {
        expectedHeaderMap.set(normalizeHeader(header), index);
      });

      // Find columns to delete:
      // 1. Columns that don't exist in expected headers
      // 2. Columns that are in wrong positions (we'll delete and recreate them)
      const columnsToDelete: number[] = [];
      for (let i = 0; i < currentHeadersArray.length; i++) {
        const currentHeader = normalizedCurrent[i];
        if (!currentHeader) {
          // Empty header, delete it
          columnsToDelete.push(i);
          continue;
        }

        const expectedIndex = expectedHeaderMap.get(currentHeader);
        if (expectedIndex === undefined) {
          // Header doesn't exist in expected headers, delete it
          columnsToDelete.push(i);
        } else if (expectedIndex !== i) {
          // Header exists but in wrong position, delete it (will be recreated in correct position)
          columnsToDelete.push(i);
        }
      }

      // Find columns to insert (expected headers that don't exist or are in wrong position)
      const columnsToInsert: { index: number; header: string }[] = [];
      for (let i = 0; i < expectedHeaders.length; i++) {
        const expectedHeader = normalizedExpected[i];
        const currentIndex = normalizedCurrent.indexOf(expectedHeader);

        if (currentIndex === -1 || currentIndex !== i) {
          // Header doesn't exist or is in wrong position, need to insert
          columnsToInsert.push({ index: i, header: expectedHeaders[i] });
        }
      }

      // Build batch update requests
      const requests: sheets_v4.Schema$Request[] = [];

      // Delete columns from right to left to avoid index shifting issues
      const sortedColumnsToDelete = [...columnsToDelete].sort((a, b) => b - a);
      for (const columnIndex of sortedColumnsToDelete) {
        requests.push({
          deleteDimension: {
            range: {
              sheetId,
              dimension: "COLUMNS",
              startIndex: columnIndex,
              endIndex: columnIndex + 1,
            },
          },
        });
      }

      // After deletions, adjust insertion indices
      // For each column to insert, count how many deletions happened before its target index
      const adjustedColumnsToInsert = columnsToInsert.map(
        ({ index, header }) => {
          // Count how many columns were deleted before this insertion point
          const deletionsBefore = columnsToDelete.filter(
            (delIndex) => delIndex < index
          ).length;
          // The new index after deletions
          const adjustedIndex = index - deletionsBefore;
          return { index: adjustedIndex, header };
        }
      );

      // Insert columns from left to right (after adjusting for deletions)
      const sortedColumnsToInsert = adjustedColumnsToInsert.sort(
        (a, b) => a.index - b.index
      );
      for (const { index } of sortedColumnsToInsert) {
        requests.push({
          insertDimension: {
            range: {
              sheetId,
              dimension: "COLUMNS",
              startIndex: index,
              endIndex: index + 1,
            },
            inheritFromBefore: false,
          },
        });
      }

      // Execute batch update if there are changes to make
      if (requests.length > 0) {
        await this.sheetsApi.spreadsheets.batchUpdate({
          spreadsheetId: this.config.spreadsheetId,
          requestBody: {
            requests,
          },
        });
      }

      // Update headers in the first row
      const endColumn = this.getColumnLetter(expectedHeaders.length);
      const updateRange = `${sheetName}!A1:${endColumn}1`;
      await this.sheetsApi.spreadsheets.values.update({
        spreadsheetId: this.config.spreadsheetId,
        range: updateRange,
        valueInputOption: "RAW",
        requestBody: {
          values: [expectedHeaders],
        },
      });
    } catch (error) {
      throw new Error(
        `Failed to update sheet headers: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  private getColumnLetter(columnNumber: number): string {
    let result = "";
    let num = columnNumber;
    while (num > 0) {
      num--;
      result = String.fromCharCode(65 + (num % 26)) + result;
      num = Math.floor(num / 26);
    }
    return result || "A";
  }
}
