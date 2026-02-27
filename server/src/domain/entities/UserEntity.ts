import { generateUUID } from "../../shared/utils/generateUUID";
import { ValidationError } from "../errors/ApplicationError";

export type UserProfile = "admin" | "user" | "guest";
export type OAuthProvider = "google" | "microsoft" | "github" | "meta" | "linkedin" | "apple";

export interface UserCreateProps {
  id?: string;
  name: string;
  email: string;
  password?: string;
  oauthProvider?: OAuthProvider;
  oauthSubject?: string;
  refreshTokenHash?: string;
  lastLoginAt?: Date | string;
  profile?: UserProfile;
}

export interface UserPrimitive {
  id: string;
  name: string;
  email: string;
  password?: string;
  oauthProvider?: OAuthProvider;
  oauthSubject?: string;
  refreshTokenHash?: string;
  lastLoginAt?: Date;
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

type UserConstructorProps = UserCreateProps & {
  createdAt?: Date | string;
  updatedAt?: Date | string;
  profile?: UserProfile;
};

const toDate = (value: Date | string | undefined, fallback: Date): Date => {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return fallback;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class UserEntity {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly password?: string;
  public readonly oauthProvider?: OAuthProvider;
  public readonly oauthSubject?: string;
  public readonly refreshTokenHash?: string;
  public readonly lastLoginAt?: Date;
  public readonly profile: UserProfile;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor({
    id,
    name,
    email,
    password,
    oauthProvider,
    oauthSubject,
    refreshTokenHash,
    lastLoginAt,
    profile,
    createdAt,
    updatedAt,
  }: UserConstructorProps) {
    this.id = id ?? generateUUID();
    this.name = name;
    this.email = email;
    this.password = password;
    this.oauthProvider = oauthProvider;
    this.oauthSubject = oauthSubject;
    this.refreshTokenHash = refreshTokenHash;
    this.lastLoginAt = lastLoginAt ? toDate(lastLoginAt, new Date()) : undefined;
    this.profile = profile ?? "user";

    const now = new Date();
    this.createdAt = toDate(createdAt, now);
    this.updatedAt = toDate(updatedAt, now);

    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new ValidationError("User name is required");
    }

    if (!this.email || !emailRegex.test(this.email)) {
      throw new ValidationError("User email is invalid");
    }

    if ((this.oauthProvider && !this.oauthSubject) || (!this.oauthProvider && this.oauthSubject)) {
      throw new ValidationError(
        "OAuth provider and subject must be informed together"
      );
    }
  }

  static create(props: UserCreateProps): UserEntity {
    const now = new Date();
    return new UserEntity({ ...props, createdAt: now, updatedAt: now });
  }

  static fromPrimitives(primitives: UserPrimitive): UserEntity {
    return new UserEntity(primitives);
  }

  toPrimitives(): UserPrimitive {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      oauthProvider: this.oauthProvider,
      oauthSubject: this.oauthSubject,
      refreshTokenHash: this.refreshTokenHash,
      lastLoginAt: this.lastLoginAt,
      profile: this.profile,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
