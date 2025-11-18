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

**Note**: You don't need to manually create sheets or set up headers. The application will automatically create the required sheets (`events`, `users`, `inscriptions`, `presences`) and configure their headers when the server starts.

## Step 2: Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 3: Create Service Account Credentials

The application uses a **Service Account** for authentication, which provides secure read/write access to your Google Sheets.

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - **Service account name**: e.g., "eventos-app"
   - **Service account ID**: auto-generated
   - Click "Create and Continue"
4. Skip the optional steps (Grant access, Grant users access) and click "Done"
5. Click on the newly created service account
6. Go to the "Keys" tab
7. Click "Add Key" > "Create new key"
8. Choose "JSON" format
9. Download the JSON file (keep it secure, never commit it to version control)

## Step 4: Extract Service Account Credentials

From the downloaded JSON file, you'll need:

- **Email**: The `client_email` field (e.g., `eventos-app@your-project.iam.gserviceaccount.com`)
- **Private Key**: The `private_key` field (a long string starting with `-----BEGIN PRIVATE KEY-----`)

## Step 5: Share Your Spreadsheet with the Service Account

1. Open your Google Spreadsheet
2. Click the "Share" button
3. Add the service account email (from Step 4) as a **Editor** (not just Viewer)
4. Click "Send" (you can uncheck "Notify people" since it's a service account)

**Important**: The service account must have **Editor** permissions to create sheets and write data.

## Step 6: Configure Environment Variables

### Back-end Configuration (`server/.env`)

Create a `.env` file in the `server/` directory:

```env
# Required: Your Google Spreadsheet ID
GOOGLE_SHEETS_ID=your-spreadsheet-id-here

# Required: Service Account Email
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com

# Required: Service Account Private Key
# Important: Keep the newlines in the key. If your .env file shows \n, replace them with actual newlines
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"

# Optional: Custom sheet ranges (defaults shown)
GOOGLE_SHEETS_EVENTS_RANGE=events!A:J
GOOGLE_SHEETS_USERS_RANGE=users!A:G
GOOGLE_SHEETS_INSCRIPTIONS_RANGE=inscriptions!A:G
GOOGLE_SHEETS_PRESENCES_RANGE=presences!A:F

# Optional: JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d

# Optional: SMTP Configuration (for email sending)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=your-email@example.com
SMTP_SECURE=false
```

### Front-end Configuration (`.env` in project root)

Create a `.env` file in the project root:

```env
# Required: Your Google Spreadsheet ID (same as back-end)
VITE_GOOGLE_SHEETS_ID=your-spreadsheet-id-here

# Required: Back-end API URL
VITE_SHEETS_PROXY_URL=http://localhost:4000/api
```

## Step 7: Automatic Sheet Initialization

When you start the server, it will automatically:

1. **Check if sheets exist**: The system checks for `events`, `users`, `inscriptions`, and `presences` sheets
2. **Create missing sheets**: If a sheet doesn't exist, it will be created automatically
3. **Validate headers**: The system checks if the sheet headers match the expected structure
4. **Update headers**: If headers don't match, they will be automatically updated

### Expected Sheet Structures

#### Events Sheet (`events`)

Headers: `id`, `title`, `description`, `dateInit`, `dateFinal`, `inscriptionInit`, `inscriptionFinal`, `location`, `createdAt`, `updatedAt`

#### Users Sheet (`users`)

Headers: `id`, `name`, `email`, `password`, `profile`, `createdAt`, `updatedAt`

#### Inscriptions Sheet (`inscriptions`)

Headers: `id`, `eventId`, `userId`, `status`, `createdAt`, `updatedAt`

#### Presences Sheet (`presences`)

Headers: `id`, `eventId`, `userId`, `presentAt`, `createdAt`

**Note**: You don't need to manually create these sheets or set up the headers. The application handles this automatically.

## Step 8: Start the Application

1. **Start the back-end server**:

   ```bash
   cd server
   npm run dev
   ```

   You should see logs indicating sheet initialization:

   ```
   Sheet "events" does not exist. Creating...
   Sheet "events" created with headers: id, title, description, ...
   Sheet "users" is properly configured with correct headers.
   ```

2. **Start the front-end** (in a new terminal):

   ```bash
   npm run dev
   ```

3. The application should now be running and connected to Google Sheets

## Troubleshooting

### Error: "Missing required environment variables"

- Make sure you created a `server/.env` file
- Verify all required variables are set: `GOOGLE_SHEETS_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
- Check that variable names match exactly (case-sensitive)

### Error: "Failed to initialize events sheet"

- Verify the service account email has **Editor** permissions on the spreadsheet
- Check that the Google Sheets API is enabled in Google Cloud Console
- Ensure the private key is correctly formatted with actual newlines (not `\n` strings)

### Error: "Invalid credentials" or "Permission denied"

- Double-check that you shared the spreadsheet with the service account email
- Verify the service account has **Editor** (not just Viewer) permissions
- Ensure the private key in `.env` has actual newlines, not `\n` escape sequences

### Private Key Format Issues

If your `.env` file shows `\n` in the private key, you need to replace them with actual newlines. The key should look like:

```
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
...
-----END PRIVATE KEY-----
"
```

### Sheets Not Being Created

- Check server logs for initialization messages
- Verify the service account has Editor permissions
- Ensure Google Sheets API is enabled
- Check that the spreadsheet ID is correct

### Headers Not Updating

- The system automatically updates headers on server startup
- If headers are incorrect, restart the server to trigger validation
- Check server logs for header update messages

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit `.env` files** to version control
2. **Service Account credentials** are sensitive - keep them secure
3. **Private keys** should never be exposed or shared
4. For production:
   - Use environment variables from your hosting platform
   - Rotate service account keys regularly
   - Limit service account permissions to only what's needed
   - Use separate service accounts for different environments

## Additional Resources

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Service Accounts Documentation](https://cloud.google.com/iam/docs/service-accounts)
- [Project Data Models](./MODELO_DADOS.md) - Detailed information about all entities
