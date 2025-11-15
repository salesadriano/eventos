import { randomUUID } from "crypto";
import { ValidationError } from "../errors/ApplicationError";

export interface EventCreateProps {
  id?: string;
  title: string;
  description?: string;
  date: Date | string;
  location?: string;
}

export interface EventPrimitive {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventPrimitiveInput {
  id: string;
  title: string;
  description: string;
  date: Date | string;
  location: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

type EventConstructorProps = EventCreateProps & {
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

const toDate = (value: Date | string | undefined, fallback?: Date): Date => {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  if (fallback) {
    return fallback;
  }

  throw new ValidationError("Invalid date value");
};

export class EventEntity {
  public readonly id: string;
  public readonly title: string;
  public readonly description: string;
  public readonly date: Date;
  public readonly location: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor({
    id,
    title,
    description,
    date,
    location,
    createdAt,
    updatedAt,
  }: EventConstructorProps) {
    this.id = id ?? randomUUID();
    this.title = title;
    this.description = description ?? "";
    this.date = toDate(date, new Date());
    this.location = location ?? "";

    const now = new Date();
    this.createdAt = toDate(createdAt, now);
    this.updatedAt = toDate(updatedAt, now);

    this.validate();
  }

  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new ValidationError("Event title is required");
    }

    if (Number.isNaN(this.date.getTime())) {
      throw new ValidationError("Event date is invalid");
    }
  }

  static create(props: EventCreateProps): EventEntity {
    const now = new Date();
    return new EventEntity({
      ...props,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPrimitives(primitives: EventPrimitiveInput): EventEntity {
    return new EventEntity(primitives);
  }

  toPrimitives(): EventPrimitive {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      date: this.date,
      location: this.location,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
