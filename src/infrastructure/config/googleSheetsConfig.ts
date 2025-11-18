import type { IGoogleSheetsConfig } from "../../domain/repositories/IGoogleSheetsConfig";

export const createGoogleSheetsConfig = (): IGoogleSheetsConfig => {
  const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_ID;
  const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
  const accessToken = import.meta.env.VITE_GOOGLE_SHEETS_ACCESS_TOKEN;
  const proxyBaseUrl = import.meta.env.VITE_SHEETS_PROXY_URL;

  if (!spreadsheetId) {
    throw new Error("VITE_GOOGLE_SHEETS_ID environment variable is required");
  }

  return {
    spreadsheetId,
    range: "events!A:J",
    apiKey: apiKey || undefined,
    accessToken: accessToken || undefined,
    proxyBaseUrl: proxyBaseUrl || undefined,
  };
};
