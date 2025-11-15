import { randomUUID } from "crypto";
import { ValidationError } from "../errors/ApplicationError";

export type InscriptionStatus = "pending" | "confirmed" | "cancelled";

export interface InscriptionCreateProps {
  id?: string;
  eventId: string;
  userId: string;
  status?: InscriptionStatus;
}

export interface InscriptionPrimitive {
  id: string;
  eventId: string;
  userId: string;
  status: InscriptionStatus;
  createdAt: Date;
  updatedAt: Date;
}

type InscriptionConstructorProps = InscriptionCreateProps & {
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

export class InscriptionEntity {
  public readonly id: string;
  public readonly eventId: string;
  public readonly userId: string;
  public readonly status: InscriptionStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor({
    id,
    eventId,
    userId,
    status,
    createdAt,
    updatedAt,
  }: InscriptionConstructorProps) {
    this.id = id ?? randomUUID();
    this.eventId = eventId;
    this.userId = userId;
    this.status = status ?? "pending";

    const now = new Date();
    this.createdAt = toDate(createdAt, now);
    this.updatedAt = toDate(updatedAt, now);

    this.validate();
  }

  private validate(): void {
    if (!this.eventId) {
      throw new ValidationError("Inscription eventId is required");
    }

    if (!this.userId) {
      throw new ValidationError("Inscription userId is required");
    }
  }

  static create(props: InscriptionCreateProps): InscriptionEntity {
    const now = new Date();
    return new InscriptionEntity({ ...props, createdAt: now, updatedAt: now });
  }

  static fromPrimitives(primitives: InscriptionPrimitive): InscriptionEntity {
    return new InscriptionEntity(primitives);
  }

  toPrimitives(): InscriptionPrimitive {
    return {
      id: this.id,
      eventId: this.eventId,
      userId: this.userId,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
