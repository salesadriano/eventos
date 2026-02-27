import { generateUUID } from "../../shared/utils/generateUUID";
import { ValidationError } from "../errors/ApplicationError";

export interface EventCreateProps {
  id?: string;
  title: string;
  description?: string;
  date?: Date | string;
  dateInit?: Date | string;
  dateFinal?: Date | string;
  inscriptionInit?: Date | string;
  inscriptionFinal?: Date | string;
  location?: string;
  appHeaderImageUrl?: string;
  certificateHeaderImageUrl?: string;
}

export interface EventPrimitive {
  id: string;
  title: string;
  description: string;
  date: Date;
  dateInit: Date;
  dateFinal: Date;
  inscriptionInit: Date;
  inscriptionFinal: Date;
  location: string;
  appHeaderImageUrl: string;
  certificateHeaderImageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventPrimitiveInput {
  id: string;
  title: string;
  description: string;
  date?: Date | string;
  dateInit?: Date | string;
  dateFinal?: Date | string;
  inscriptionInit?: Date | string;
  inscriptionFinal?: Date | string;
  location: string;
  appHeaderImageUrl?: string;
  certificateHeaderImageUrl?: string;
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
  public readonly dateInit: Date;
  public readonly dateFinal: Date;
  public readonly inscriptionInit: Date;
  public readonly inscriptionFinal: Date;
  public readonly location: string;
  public readonly appHeaderImageUrl: string;
  public readonly certificateHeaderImageUrl: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor({
    id,
    title,
    description,
    date,
    dateInit,
    dateFinal,
    inscriptionInit,
    inscriptionFinal,
    location,
    appHeaderImageUrl,
    certificateHeaderImageUrl,
    createdAt,
    updatedAt,
  }: EventConstructorProps) {
    this.id = id ?? generateUUID();
    this.title = title;
    this.description = description ?? "";

    // Support both old format (date) and new format (dateInit/dateFinal)
    const now = new Date();
    if (date) {
      const dateValue = toDate(date, now);
      this.dateInit = dateInit ? toDate(dateInit, dateValue) : dateValue;
      this.dateFinal = dateFinal ? toDate(dateFinal, dateValue) : dateValue;
    } else {
      this.dateInit = toDate(dateInit, now);
      this.dateFinal = toDate(dateFinal, now);
    }

    this.inscriptionInit = toDate(inscriptionInit, now);
    this.inscriptionFinal = toDate(inscriptionFinal, now);
    this.location = location ?? "";
    this.appHeaderImageUrl = appHeaderImageUrl?.trim() ?? "";
    this.certificateHeaderImageUrl =
      certificateHeaderImageUrl?.trim() ?? "";

    this.createdAt = toDate(createdAt, now);
    this.updatedAt = toDate(updatedAt, now);

    this.validate();
  }

  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new ValidationError("Event title is required");
    }
    if (Number.isNaN(this.dateInit.getTime())) {
      throw new ValidationError("Event initial date is invalid");
    }
    if (Number.isNaN(this.dateFinal.getTime())) {
      throw new ValidationError("Event final date is invalid");
    }
    if (Number.isNaN(this.inscriptionInit.getTime())) {
      throw new ValidationError("Event inscription initial date is invalid");
    }
    if (Number.isNaN(this.inscriptionFinal.getTime())) {
      throw new ValidationError("Event inscription final date is invalid");
    }
    if (!this.location || this.location.trim().length === 0) {
      throw new ValidationError("Event location is required");
    }

    if (
      this.appHeaderImageUrl.length > 0 &&
      !this.isValidHttpUrl(this.appHeaderImageUrl)
    ) {
      throw new ValidationError("Event app header image URL is invalid");
    }

    if (
      this.certificateHeaderImageUrl.length > 0 &&
      !this.isValidHttpUrl(this.certificateHeaderImageUrl)
    ) {
      throw new ValidationError("Event certificate header image URL is invalid");
    }
  }

  private isValidHttpUrl(value: string): boolean {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
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
      date: this.dateInit, // For backward compatibility, use dateInit as date
      dateInit: this.dateInit,
      dateFinal: this.dateFinal,
      inscriptionInit: this.inscriptionInit,
      inscriptionFinal: this.inscriptionFinal,
      location: this.location,
      appHeaderImageUrl: this.appHeaderImageUrl,
      certificateHeaderImageUrl: this.certificateHeaderImageUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
