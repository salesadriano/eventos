import { generateUUID } from "../../shared/utils/generateUUID";
import { ValidationError } from "../errors/ApplicationError";

export type InscriptionStatus = "pending" | "confirmed" | "cancelled";

export interface InscriptionCreateProps {
  id?: string;
  eventId: string;
  userId: string;
  activityId?: string;
  status?: InscriptionStatus;
}

export interface InscriptionPrimitive {
  id: string;
  eventId: string;
  userId: string;
  activityId: string;
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
  public readonly activityId: string;
  public readonly status: InscriptionStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor({
    id,
    eventId,
    userId,
    activityId,
    status,
    createdAt,
    updatedAt,
  }: InscriptionConstructorProps) {
    this.id = id ?? generateUUID();
    this.eventId = eventId;
    this.userId = userId;
    this.activityId = activityId?.trim() ?? "";
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
      activityId: this.activityId,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
