import type { IGoogleSheetsConfig } from "../../domain/repositories/IGoogleSheetsConfig";
import type { IGoogleSheetsClient } from "./IGoogleSheetsClient";

export class GoogleSheetsApiClient implements IGoogleSheetsClient {
  private readonly googleBaseUrl =
    "https://sheets.googleapis.com/v4/spreadsheets";

  constructor(private readonly config: IGoogleSheetsConfig) {}

  async read(range: string): Promise<string[][]> {
    if (this.usesProxy()) {
      const response = await fetch(
        this.buildProxyUrl("sheets/values", { range })
      );
      const data = (await this.parseJsonResponse(
        response,
        "read from Google Sheets via proxy"
      )) as { values?: string[][] };
      return data?.values ?? [];
    }

    const encodedRange = encodeURIComponent(range);
    const url = `${this.googleBaseUrl}/${
      this.config.spreadsheetId
    }/values/${encodedRange}${
      this.config.apiKey ? `?key=${this.config.apiKey}` : ""
    }`;

    const response = await fetch(url, {
      headers: this.getDirectHeaders(),
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
    if (this.usesProxy()) {
      await this.sendProxyRequest("PUT", "sheets/values", {
        range,
        values,
      });
      return;
    }

    const url = `${this.googleBaseUrl}/${this.config.spreadsheetId}/values/${range}?valueInputOption=RAW`;

    const response = await fetch(url, {
      method: "PUT",
      headers: this.getDirectHeaders(),
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
    if (this.usesProxy()) {
      await this.sendProxyRequest("POST", "sheets/append", {
        range: this.config.range,
        values,
      });
      return;
    }

    const url = `${this.googleBaseUrl}/${this.config.spreadsheetId}/values/${this.config.range}:append?valueInputOption=RAW`;

    const response = await fetch(url, {
      method: "POST",
      headers: this.getDirectHeaders(),
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
    if (this.usesProxy()) {
      await this.sendProxyRequest("PUT", "sheets/values", {
        range,
        values,
      });
      return;
    }

    const url = `${this.googleBaseUrl}/${this.config.spreadsheetId}/values/${range}?valueInputOption=RAW`;

    const response = await fetch(url, {
      method: "PUT",
      headers: this.getDirectHeaders(),
      body: JSON.stringify({
        values,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update Google Sheets: ${response.statusText}`);
    }
  }

  async delete(range: string): Promise<void> {
    if (this.usesProxy()) {
      await this.sendProxyRequest("POST", "sheets/clear", {
        range,
      });
      return;
    }

    // Note: Google Sheets API doesn't have a direct delete endpoint for ranges
    // We'll clear the range instead
    const url = `${this.googleBaseUrl}/${this.config.spreadsheetId}/values/${range}:clear`;

    const response = await fetch(url, {
      method: "POST",
      headers: this.getDirectHeaders(),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete from Google Sheets: ${response.statusText}`
      );
    }
  }

  private usesProxy(): boolean {
    return Boolean(this.config.proxyBaseUrl);
  }

  private getDirectHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.config.accessToken) {
      headers["Authorization"] = `Bearer ${this.config.accessToken}`;
    }

    return headers;
  }

  private buildProxyUrl(path: string, query?: Record<string, string>): string {
    if (!this.config.proxyBaseUrl) {
      throw new Error("Proxy base URL is not configured");
    }

    const base = this.config.proxyBaseUrl.endsWith("/")
      ? this.config.proxyBaseUrl.slice(0, -1)
      : this.config.proxyBaseUrl;

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    const searchParams = query
      ? new URLSearchParams(
          Object.entries(query).filter(([, value]) => value !== undefined)
        ).toString()
      : "";

    return `${base}${normalizedPath}${searchParams ? `?${searchParams}` : ""}`;
  }

  private async sendProxyRequest(
    method: "POST" | "PUT",
    path: string,
    body: Record<string, unknown>
  ): Promise<void> {
    const response = await fetch(this.buildProxyUrl(path), {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to ${method.toLowerCase()} ${path} via proxy: ${
          response.statusText
        } - ${errorText}`
      );
    }
  }

  private async parseJsonResponse(
    response: Response,
    action: string
  ): Promise<Record<string, unknown>> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to ${action}: ${response.statusText} - ${errorText}`
      );
    }

    return response.json();
  }
}
