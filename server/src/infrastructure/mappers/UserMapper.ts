import { UserEntity } from "../../domain/entities/UserEntity";

const HEADER = ["id", "name", "email", "password", "profile", "createdAt", "updatedAt"];

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

    return new UserEntity({
      id: ensureValue(row[0]),
      name: ensureValue(row[1]),
      email: ensureValue(row[2]),
      password: ensureValue(row[3]) || undefined,
      profile: (ensureValue(row[4]) || "user") as "admin" | "user" | "guest",
      createdAt: ensureValue(row[5], new Date().toISOString()),
      updatedAt: ensureValue(row[6], new Date().toISOString()),
    });
  },

  toRow(user: UserEntity): string[] {
    const primitives = user.toPrimitives();
    return [
      primitives.id,
      primitives.name,
      primitives.email,
      primitives.password || "",
      primitives.profile,
      primitives.createdAt.toISOString(),
      primitives.updatedAt.toISOString(),
    ];
  },
};
