export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  dateInit: Date;
  dateFinal: Date;
  inscriptionInit: Date;
  inscriptionFinal: Date;
  location: string;
  appHeaderImageUrl?: string;
  certificateHeaderImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class EventEntity implements Event {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly date: Date,
    public readonly dateInit: Date,
    public readonly dateFinal: Date,
    public readonly inscriptionInit: Date,
    public readonly inscriptionFinal: Date,
    public readonly location: string,
    public readonly appHeaderImageUrl: string,
    public readonly certificateHeaderImageUrl: string,
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
      data.dateInit,
      data.dateFinal,
      data.inscriptionInit,
      data.inscriptionFinal,
      data.location,
      data.appHeaderImageUrl ?? "",
      data.certificateHeaderImageUrl ?? "",
      now,
      now
    );
  }

  static fromRow(row: string[]): EventEntity {
    const date = new Date(row[3]);
    const dateInit = new Date(row[4] || row[3]);
    const dateFinal = new Date(row[5] || row[3]);
    const inscriptionInit = new Date(row[6] || row[3]);
    const inscriptionFinal = new Date(row[7] || row[3]);
    return new EventEntity(
      row[0], // id
      row[1], // title
      row[2], // description
      date,
      dateInit,
      dateFinal,
      inscriptionInit,
      inscriptionFinal,
      row[8] || row[4], // location
      row[9] || "",
      row[10] || "",
      new Date(row[11] || row[5]),
      new Date(row[12] || row[6])
    );
  }

  toRow(): string[] {
    return [
      this.id,
      this.title,
      this.description,
      this.date.toISOString(),
      this.dateInit.toISOString(),
      this.dateFinal.toISOString(),
      this.inscriptionInit.toISOString(),
      this.inscriptionFinal.toISOString(),
      this.location,
      this.appHeaderImageUrl,
      this.certificateHeaderImageUrl,
      this.createdAt.toISOString(),
      this.updatedAt.toISOString(),
    ];
  }
}
