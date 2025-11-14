# Google Sheets Configuration Guide

This guide will help you set up Google Sheets as your database for the Events application.

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Step 1: Create a Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it (e.g., "Events Database")
4. **Get the Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```
   Copy the `SPREADSHEET_ID` part

## Step 2: Set Up the Sheet Structure

1. In your spreadsheet, set up the header row in row 1:
   - Column A: `id`
   - Column B: `title`
   - Column C: `description`
   - Column D: `date`
   - Column E: `location`
   - Column F: `createdAt`
   - Column G: `updatedAt`

2. **Important**: Make sure the sheet is named `Sheet1` (or update the range in the config)

## Step 3: Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 4: Create API Credentials

### Option A: API Key (Recommended for Public Sheets - Read Only)

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key
4. **Restrict the API Key** (recommended):
   - Click on the API key to edit
   - Under "API restrictions", select "Restrict key"
   - Choose "Google Sheets API"
   - Save

### Option B: OAuth 2.0 (For Private Sheets - Read/Write)

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Add authorized redirect URIs (for your app)
5. Download the credentials JSON file
6. Use OAuth flow to get an access token

## Step 5: Share Your Spreadsheet (if using API Key)

If you're using an API key with a private sheet, you need to:

1. Open your spreadsheet
2. Click "Share" button
3. Share with the service account email (if using service account) OR
4. Make the sheet **public** (View only):
   - Click "Share" > "Change to anyone with the link"
   - Set permission to "Viewer"

**Note**: For write access with API key, the sheet must be publicly editable (not recommended for production).

## Step 6: Configure Environment Variables

1. Create a `.env` file in the root of your project:

```env
# Required: Your Google Spreadsheet ID
VITE_GOOGLE_SHEETS_ID=your-spreadsheet-id-here

# Required: Google Sheets API Key
VITE_GOOGLE_SHEETS_API_KEY=your-api-key-here

# Optional: OAuth Access Token (if using OAuth instead of API key)
VITE_GOOGLE_SHEETS_ACCESS_TOKEN=
```

2. Replace the placeholder values with your actual credentials

## Step 7: Update Configuration (Optional)

If you want to use a different sheet name or range, edit:
`src/infrastructure/config/googleSheetsConfig.ts`

```typescript
return {
  spreadsheetId,
  range: "YourSheetName!A:G", // Change sheet name here
  apiKey: apiKey || undefined,
  accessToken: accessToken || undefined,
};
```

## Step 8: Test the Configuration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. The app should load events from your Google Sheet
3. Check the browser console for any errors

## Troubleshooting

### Error: "Failed to read from Google Sheets"
- Check that your API key is correct
- Verify the spreadsheet ID is correct
- Ensure Google Sheets API is enabled
- Check that the sheet is shared (if private)

### Error: "VITE_GOOGLE_SHEETS_ID environment variable is required"
- Make sure you created a `.env` file
- Verify the variable name starts with `VITE_`
- Restart your dev server after creating/updating `.env`

### Error: "Failed to write to Google Sheets"
- API keys have limited write access
- Consider using OAuth 2.0 for write operations
- Or make the sheet publicly editable (not recommended)

### Data not appearing
- Check that the header row is in row 1
- Verify column order matches: id, title, description, date, location, createdAt, updatedAt
- Check that the sheet name matches the range (default: "Sheet1")

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit `.env` files** to version control
2. **API Keys** are exposed in the client-side code (they're in `VITE_` variables)
3. For production, consider:
   - Using a backend API to proxy requests
   - Using OAuth 2.0 with proper token management
   - Restricting API key to specific domains
   - Using service accounts for server-side operations

## Example Sheet Structure

| id | title | description | date | location | createdAt | updatedAt |
|----|-------|-------------|------|---------|-----------|-----------|
| abc-123 | Sample Event | This is a test event | 2024-01-15T10:00:00Z | New York | 2024-01-01T00:00:00Z | 2024-01-01T00:00:00Z |

## Additional Resources

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Vite Environment Variables](https://vite.dev/guide/env-and-mode.html)

