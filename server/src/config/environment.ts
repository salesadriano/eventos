import "dotenv/config";

type RequiredEnvKey =
  | "GOOGLE_SHEETS_ID"
  | "GOOGLE_SERVICE_ACCOUNT_EMAIL"
  | "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY";

const requiredVariables: RequiredEnvKey[] = [
  "GOOGLE_SHEETS_ID",
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
];

const missing = requiredVariables.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}`
  );
}

const normalizePrivateKey = (value: string): string =>
  value.replace(/\\n/g, "\n");

const parsePort = (value: string | undefined): number => {
  const parsed = Number.parseInt(value ?? "4000", 10);
  return Number.isNaN(parsed) ? 4000 : parsed;
};

const parseSmtpPort = (value: string | undefined): number => {
  const parsed = Number.parseInt(value ?? "587", 10);
  return Number.isNaN(parsed) ? 587 : parsed;
};

const parseInteger = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? `${fallback}`, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const parseScopes = (value: string | undefined, fallback: string[]): string[] =>
  value
    ? value
        .split(/[,\s]+/)
        .map((scope) => scope.trim())
        .filter(Boolean)
    : fallback;

const corsOrigins = process.env.CORS_ALLOW_ORIGIN
  ? process.env.CORS_ALLOW_ORIGIN.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : undefined;

const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!;

const defaultRanges = {
  events: process.env.GOOGLE_SHEETS_EVENTS_RANGE ?? "events!A:J",
  users: process.env.GOOGLE_SHEETS_USERS_RANGE ?? "users!A:K",
  inscriptions:
    process.env.GOOGLE_SHEETS_INSCRIPTIONS_RANGE ?? "inscriptions!A:G",
  presences: process.env.GOOGLE_SHEETS_PRESENCES_RANGE ?? "presences!A:F",
};

const oauthGoogleConfigured = Boolean(
  process.env.OAUTH_GOOGLE_CLIENT_ID &&
    process.env.OAUTH_GOOGLE_CLIENT_SECRET &&
    process.env.OAUTH_GOOGLE_REDIRECT_URI
);

export const environment = {
  port: parsePort(process.env.PORT),
  cors: {
    allowOrigin: corsOrigins,
  },
  googleSheets: {
    spreadsheetId: process.env.GOOGLE_SHEETS_ID!,
    ranges: defaultRanges,
    serviceAccount: {
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      privateKey: normalizePrivateKey(privateKey),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    },
  },
  smtp:
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
      ? {
          host: process.env.SMTP_HOST,
          port: parseSmtpPort(process.env.SMTP_PORT),
          secure: process.env.SMTP_SECURE === "true", // false for STARTTLS on port 587
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
        }
      : undefined,
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
    accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || "15m",
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || "7d",
  },
  oauth: {
    stateTtlSeconds: parseInteger(process.env.OAUTH_STATE_TTL_SECONDS, 600),
    providers: {
      google: oauthGoogleConfigured
        ? {
            clientId: process.env.OAUTH_GOOGLE_CLIENT_ID!,
            clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET!,
            redirectUri: process.env.OAUTH_GOOGLE_REDIRECT_URI!,
            authorizationUrl:
              process.env.OAUTH_GOOGLE_AUTH_URL ??
              "https://accounts.google.com/o/oauth2/v2/auth",
            tokenUrl:
              process.env.OAUTH_GOOGLE_TOKEN_URL ??
              "https://oauth2.googleapis.com/token",
            userInfoUrl:
              process.env.OAUTH_GOOGLE_USERINFO_URL ??
              "https://openidconnect.googleapis.com/v1/userinfo",
            scopes: parseScopes(process.env.OAUTH_GOOGLE_SCOPES, [
              "openid",
              "profile",
              "email",
            ]),
          }
        : undefined,
    },
  },
};

export type Environment = typeof environment;
