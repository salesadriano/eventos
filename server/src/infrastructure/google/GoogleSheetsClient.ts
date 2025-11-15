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
}
