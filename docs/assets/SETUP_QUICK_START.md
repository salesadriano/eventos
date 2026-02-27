# Quick Start: Google Sheets Setup

## 1. Create Your Spreadsheet

1. Go to https://sheets.google.com
2. Create a new spreadsheet
3. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[THIS_IS_YOUR_ID]/edit
   ```

**Note**: You don't need to create sheets manually. The application will automatically create `events`, `users`, `inscriptions`, and `presences` sheets when the server starts.

## 2. Set Up Service Account

1. Go to https://console.cloud.google.com/
2. Create/Select a project
3. Enable "Google Sheets API" (APIs & Services > Library)
4. Create Service Account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in name and click "Create and Continue"
   - Skip optional steps and click "Done"
5. Create Key:
   - Click on the service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key" > "JSON"
   - Download the JSON file
6. Extract credentials from JSON:
   - `client_email` → Service Account Email
   - `private_key` → Private Key (keep newlines!)

## 3. Share Your Spreadsheet

1. Open your spreadsheet
2. Click "Share"
3. Add the service account email (from Step 2) as **Editor**
4. Click "Send"

**Important**: The service account must have **Editor** permissions.

## 4. Configure Environment Variables

### Back-end (`server/.env`)

Create `server/.env`:

```env
GOOGLE_SHEETS_ID=your-spreadsheet-id-here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nKey\nHere\n-----END PRIVATE KEY-----\n"
```

**Note**: The private key must have actual newlines, not `\n` strings.

### Front-end (`.env` in project root)

Create `.env`:

```env
VITE_GOOGLE_SHEETS_ID=your-spreadsheet-id-here
VITE_SHEETS_PROXY_URL=http://localhost:4000/api
```

## 5. Mail Server Configuration (Optional)

If you want to enable email sending functionality, add SMTP configuration to `server/.env`:

```env
# SMTP Configuration (Optional)
SMTP_HOST=webmail.ac.gov.br
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@ac.gov.br
SMTP_PASS=your-password
SMTP_FROM=your-email@ac.gov.br  # Optional, defaults to SMTP_USER
```

**Note**: Email service is optional. The application will work without it, but email endpoints will return errors if SMTP is not configured.

For detailed email setup instructions, see [EMAIL_SETUP.md](./EMAIL_SETUP.md)

## 6. Start the Application

1. **Start back-end**:

   ```bash
   cd server && npm run dev
   ```

   The server will automatically:

   - Create missing sheets (`events`, `users`, `inscriptions`, `presences`)
   - Validate and update sheet headers
   - Log initialization status

2. **Start front-end** (new terminal):
   ```bash
   npm run dev
   ```

That's it! Your app should now connect to Google Sheets.

## What Gets Created Automatically

When the server starts, it automatically:

- ✅ Creates `events` sheet with headers: `id`, `title`, `description`, `dateInit`, `dateFinal`, `inscriptionInit`, `inscriptionFinal`, `location`, `createdAt`, `updatedAt`
- ✅ Creates `users` sheet with headers: `id`, `name`, `email`, `password`, `profile`, `createdAt`, `updatedAt`
- ✅ Creates `inscriptions` sheet with headers: `id`, `eventId`, `userId`, `status`, `createdAt`, `updatedAt`
- ✅ Creates `presences` sheet with headers: `id`, `eventId`, `userId`, `presentAt`, `createdAt`
- ✅ Validates and updates headers if they don't match

You don't need to manually set up any sheets or headers!

## Troubleshooting

- **"Missing required environment variables"**: Check that `server/.env` has all three required Google Sheets variables
- **"Permission denied"**: Make sure the service account email has **Editor** permissions on the spreadsheet
- **"Invalid credentials"**: Verify the private key has actual newlines (not `\n` strings)
- **Sheets not created**: Check server logs and ensure the service account has Editor permissions
- **Email not working**: Verify SMTP configuration in `server/.env` (email service is optional)

For detailed instructions, see:

- [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) - Complete Google Sheets setup guide
- [EMAIL_SETUP.md](./EMAIL_SETUP.md) - Complete email service setup guide
