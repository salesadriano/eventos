import { EventService } from "../../application/services/EventService";
import { GoogleSheetsEventRepository } from "../repositories/GoogleSheetsEventRepository";
import { GoogleSheetsApiClient } from "../google-sheets/GoogleSheetsApiClient";
import type { IGoogleSheetsConfig } from "../../domain/repositories/IGoogleSheetsConfig";

export class Container {
  private static eventService: EventService | null = null;

  static createEventService(config: IGoogleSheetsConfig): EventService {
    if (this.eventService) {
      return this.eventService;
    }

    const sheetsClient = new GoogleSheetsApiClient(config);
    const repository = new GoogleSheetsEventRepository(sheetsClient, config);
    this.eventService = new EventService(repository);

    return this.eventService;
  }

  static reset(): void {
    this.eventService = null;
  }
}
