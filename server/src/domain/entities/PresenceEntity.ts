import { generateUUID } from "../../shared/utils/generateUUID";
import { ValidationError } from "../errors/ApplicationError";

export interface PresenceCreateProps {
  id?: string;
  eventId: string;
  userId: string;
  presentAt?: Date | string;
}

export interface PresencePrimitive {
  id: string;
  eventId: string;
  userId: string;
  presentAt: Date;
  createdAt: Date;
}

type PresenceConstructorProps = PresenceCreateProps & {
  presentAt?: Date | string;
  createdAt?: Date | string;
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

export class PresenceEntity {
  public readonly id: string;
  public readonly eventId: string;
  public readonly userId: string;
  public readonly presentAt: Date;
  public readonly createdAt: Date;

  constructor({
    id,
    eventId,
    userId,
    presentAt,
    createdAt,
  }: PresenceConstructorProps) {
    this.id = id ?? generateUUID();
    this.eventId = eventId;
    this.userId = userId;

    const now = new Date();
    this.presentAt = toDate(presentAt, now);
    this.createdAt = toDate(createdAt, now);

    this.validate();
  }

  private validate(): void {
    if (!this.eventId) {
      throw new ValidationError("Presence eventId is required");
    }

    if (!this.userId) {
      throw new ValidationError("Presence userId is required");
    }
  }

  static create(props: PresenceCreateProps): PresenceEntity {
    const now = new Date();
    return new PresenceEntity({
      ...props,
      createdAt: now,
      presentAt: props.presentAt ?? now,
    });
  }

  static fromPrimitives(primitives: PresencePrimitive): PresenceEntity {
    return new PresenceEntity(primitives);
  }

  toPrimitives(): PresencePrimitive {
    return {
      id: this.id,
      eventId: this.eventId,
      userId: this.userId,
      presentAt: this.presentAt,
      createdAt: this.createdAt,
    };
  }
}
