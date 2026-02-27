export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export class EventEntity implements Event {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly date: Date,
    public readonly location: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error("Event title is required");
    }
    if (!this.date || isNaN(this.date.getTime())) {
      throw new Error("Event date is invalid");
    }
  }

  static create(
    data: Omit<Event, "id" | "createdAt" | "updatedAt">
  ): EventEntity {
    const now = new Date();
    const id = crypto.randomUUID();
    return new EventEntity(
      id,
      data.title,
      data.description,
      data.date,
      data.location,
      now,
      now
    );
  }

  static fromRow(row: string[]): EventEntity {
    return new EventEntity(
      row[0], // id
      row[1], // title
      row[2], // description
      new Date(row[3]), // date
      row[4], // location
      new Date(row[5]), // createdAt
      new Date(row[6]) // updatedAt
    );
  }

  toRow(): string[] {
    return [
      this.id,
      this.title,
      this.description,
      this.date.toISOString(),
      this.location,
      this.createdAt.toISOString(),
      this.updatedAt.toISOString(),
    ];
  }
}
