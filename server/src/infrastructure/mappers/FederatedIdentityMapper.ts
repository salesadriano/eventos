import type { OAuthProviderType } from "../../domain/entities/FederatedIdentityEntity";
import { FederatedIdentityEntity } from "../../domain/entities/FederatedIdentityEntity";

const HEADER = [
  "id",
  "userId",
  "provider",
  "subject",
  "email",
  "name",
  "emailVerified",
  "linkedAt",
];

const OAUTH_PROVIDERS: OAuthProviderType[] = [
  "google",
  "microsoft",
  "github",
  "apple",
  "linkedin",
  "meta",
];

const ensureValue = (value: string | undefined, fallback = ""): string =>
  value !== undefined && value !== null ? value : fallback;

export const FederatedIdentityMapper = {
  header(): string[] {
    return [...HEADER];
  },

  toEntity(row: string[]): FederatedIdentityEntity | null {
    if (!row || row.length === 0 || !row[0]) {
      return null;
    }

    const provider = ensureValue(row[2]);
    const isValidProvider = OAUTH_PROVIDERS.includes(
      provider as OAuthProviderType,
    );

    if (!isValidProvider) {
      return null;
    }

    return new FederatedIdentityEntity({
      id: ensureValue(row[0]),
      userId: ensureValue(row[1]),
      provider: provider as OAuthProviderType,
      subject: ensureValue(row[3]),
      email: ensureValue(row[4]) || undefined,
      name: ensureValue(row[5]) || undefined,
      emailVerified: ensureValue(row[6]) === "true",
    });
  },

  toRow(identity: FederatedIdentityEntity): string[] {
    const primitives = identity.toPrimitives();
    return [
      primitives.id,
      primitives.userId,
      primitives.provider,
      primitives.subject,
      primitives.email || "",
      primitives.name || "",
      primitives.emailVerified ? "true" : "false",
      primitives.linkedAt.toISOString(),
    ];
  },
};
