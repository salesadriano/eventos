process.env.GOOGLE_SHEETS_ID =
  process.env.GOOGLE_SHEETS_ID ?? "test-spreadsheet-id";
process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL =
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "service-account@test.local";
process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY =
  process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ??
  "-----BEGIN PRIVATE KEY-----\\nFAKEKEY\\n-----END PRIVATE KEY-----\\n";
process.env.GOOGLE_SHEETS_EVENTS_RANGE =
  process.env.GOOGLE_SHEETS_EVENTS_RANGE ?? "events!A:J";
process.env.GOOGLE_SHEETS_USERS_RANGE =
  process.env.GOOGLE_SHEETS_USERS_RANGE ?? "users!A:F";
process.env.GOOGLE_SHEETS_INSCRIPTIONS_RANGE =
  process.env.GOOGLE_SHEETS_INSCRIPTIONS_RANGE ?? "inscriptions!A:G";
process.env.GOOGLE_SHEETS_PRESENCES_RANGE =
  process.env.GOOGLE_SHEETS_PRESENCES_RANGE ?? "presences!A:F";
process.env.PORT = process.env.PORT ?? "0";
