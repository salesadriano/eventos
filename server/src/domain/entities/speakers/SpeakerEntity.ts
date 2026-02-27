import { generateUUID } from "../../../shared/utils/generateUUID";
import { ValidationError } from "../../errors/ApplicationError";

export interface SpeakerCreateProps {
  id?: string;
  name: string;
  email: string;
  bio?: string;
  socialLinks?: string[];
}

export interface SpeakerPrimitive {
  id: string;
  name: string;
  email: string;
  bio: string;
  socialLinks: string[];
  createdAt: Date;
  updatedAt: Date;
}

type SpeakerConstructorProps = SpeakerCreateProps & {
  createdAt?: Date | string;
  updatedAt?: Date | string;
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

export class SpeakerEntity {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly bio: string;
  public readonly socialLinks: string[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor({
    id,
    name,
    email,
    bio,
    socialLinks,
    createdAt,
    updatedAt,
  }: SpeakerConstructorProps) {
    const now = new Date();
    this.id = id ?? generateUUID();
    this.name = name;
    this.email = email;
    this.bio = bio ?? "";
    this.socialLinks = socialLinks ?? [];
    this.createdAt = toDate(createdAt, now);
    this.updatedAt = toDate(updatedAt, now);

    this.validate();
  }

  private validate(): void {
    if (!this.name.trim()) {
      throw new ValidationError("Speaker name is required");
    }

    if (!this.email.trim() || !this.email.includes("@")) {
      throw new ValidationError("Speaker email is invalid");
    }
  }

  static create(props: SpeakerCreateProps): SpeakerEntity {
    const now = new Date();
    return new SpeakerEntity({
      ...props,
      createdAt: now,
      updatedAt: now,
    });
  }

  toPrimitives(): SpeakerPrimitive {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      bio: this.bio,
      socialLinks: this.socialLinks,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
