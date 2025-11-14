# Quick Start: Google Sheets Setup

## 1. Create Your Spreadsheet

1. Go to https://sheets.google.com
2. Create a new spreadsheet
3. Add headers in row 1:
   ```
   id | title | description | date | location | createdAt | updatedAt
   ```
4. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[THIS_IS_YOUR_ID]/edit
   ```

## 2. Get API Key

1. Go to https://console.cloud.google.com/
2. Create/Select a project
3. Enable "Google Sheets API" (APIs & Services > Library)
4. Create API Key (APIs & Services > Credentials > Create Credentials > API Key)
5. Copy the API key

## 3. Share Your Sheet

- Click "Share" on your spreadsheet
- Set to "Anyone with the link" > "Viewer" (for read-only with API key)
- Or use OAuth for write access (see full guide)

## 4. Create .env File

Create a `.env` file in the project root:

```env
VITE_GOOGLE_SHEETS_ID=your-spreadsheet-id-here
VITE_GOOGLE_SHEETS_API_KEY=your-api-key-here
```

## 5. Start the App

```bash
npm run dev
```

That's it! Your app should now connect to Google Sheets.

For detailed instructions, see [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)

