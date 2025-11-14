import type { IGoogleSheetsConfig } from "../../domain/repositories/IGoogleSheetsConfig";
import type { IGoogleSheetsClient } from "./IGoogleSheetsClient";

export class GoogleSheetsApiClient implements IGoogleSheetsClient {
  private readonly baseUrl = "https://sheets.googleapis.com/v4/spreadsheets";

  constructor(private readonly config: IGoogleSheetsConfig) {}

  async read(range: string): Promise<string[][]> {
    const encodedRange = encodeURIComponent(range);
    const url = `${this.baseUrl}/${
      this.config.spreadsheetId
    }/values/${encodedRange}${
      this.config.apiKey ? `?key=${this.config.apiKey}` : ""
    }`;

    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to read from Google Sheets: ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    return data.values || [];
  }

  async write(range: string, values: string[][]): Promise<void> {
    const url = `${this.baseUrl}/${this.config.spreadsheetId}/values/${range}?valueInputOption=RAW`;

    const response = await fetch(url, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify({
        values,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to write to Google Sheets: ${response.statusText}`
      );
    }
  }

  async append(values: string[][]): Promise<void> {
    const url = `${this.baseUrl}/${this.config.spreadsheetId}/values/${this.config.range}:append?valueInputOption=RAW`;

    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        values,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to append to Google Sheets: ${response.statusText}`
      );
    }
  }

  async update(range: string, values: string[][]): Promise<void> {
    const url = `${this.baseUrl}/${this.config.spreadsheetId}/values/${range}?valueInputOption=RAW`;

    const response = await fetch(url, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify({
        values,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update Google Sheets: ${response.statusText}`);
    }
  }

  async delete(range: string): Promise<void> {
    // Note: Google Sheets API doesn't have a direct delete endpoint for ranges
    // We'll clear the range instead
    const url = `${this.baseUrl}/${this.config.spreadsheetId}/values/${range}:clear`;

    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete from Google Sheets: ${response.statusText}`
      );
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.config.accessToken) {
      headers["Authorization"] = `Bearer ${this.config.accessToken}`;
    }

    return headers;
  }
}
