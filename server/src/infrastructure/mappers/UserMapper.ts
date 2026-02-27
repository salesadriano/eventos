import { UserEntity } from "../../domain/entities/UserEntity";
import type { OAuthProvider } from "../../domain/entities/UserEntity";

const HEADER = [
  "id",
  "name",
  "email",
  "password",
  "oauthProvider",
  "oauthSubject",
  "refreshTokenHash",
  "lastLoginAt",
  "profile",
  "createdAt",
  "updatedAt",
];

const PROFILES = new Set(["admin", "user", "guest"]);
const OAUTH_PROVIDERS: OAuthProvider[] = [
  "google",
  "microsoft",
  "github",
  "meta",
  "linkedin",
  "apple",
];

const ensureValue = (value: string | undefined, fallback = ""): string =>
  value !== undefined && value !== null ? value : fallback;

export const UserMapper = {
  header(): string[] {
    return [...HEADER];
  },

  toEntity(row: string[]): UserEntity | null {
    if (!row || row.length === 0 || !row[0]) {
      return null;
    }

    const isLegacySchema = PROFILES.has((row[4] ?? "").toLowerCase()) && !row[8];

    const rawProvider = isLegacySchema ? "" : ensureValue(row[4]);
    const oauthProvider = OAUTH_PROVIDERS.includes(rawProvider as OAuthProvider)
      ? (rawProvider as OAuthProvider)
      : undefined;
    const oauthSubject = isLegacySchema ? undefined : ensureValue(row[5]) || undefined;
    const refreshTokenHash = isLegacySchema ? undefined : ensureValue(row[6]) || undefined;
    const lastLoginAt = isLegacySchema ? undefined : ensureValue(row[7]) || undefined;
    const profile = isLegacySchema
      ? ensureValue(row[4]) || "user"
      : ensureValue(row[8]) || "user";
    const createdAt = isLegacySchema
      ? ensureValue(row[5], new Date().toISOString())
      : ensureValue(row[9], new Date().toISOString());
    const updatedAt = isLegacySchema
      ? ensureValue(row[6], new Date().toISOString())
      : ensureValue(row[10], new Date().toISOString());

    return new UserEntity({
      id: ensureValue(row[0]),
      name: ensureValue(row[1]),
      email: ensureValue(row[2]),
      password: ensureValue(row[3]) || undefined,
      oauthProvider,
      oauthSubject,
      refreshTokenHash,
      lastLoginAt,
      profile: profile as "admin" | "user" | "guest",
      createdAt,
      updatedAt,
    });
  },

  toRow(user: UserEntity): string[] {
    const primitives = user.toPrimitives();
    return [
      primitives.id,
      primitives.name,
      primitives.email,
      primitives.password || "",
      primitives.oauthProvider || "",
      primitives.oauthSubject || "",
      primitives.refreshTokenHash || "",
      primitives.lastLoginAt?.toISOString() || "",
      primitives.profile,
      primitives.createdAt.toISOString(),
      primitives.updatedAt.toISOString(),
    ];
  },
};
