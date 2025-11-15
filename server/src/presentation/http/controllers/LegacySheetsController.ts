import type { NextFunction, Request, Response } from "express";
import type { CreateEventUseCase } from "../../../application/usecases/events/CreateEventUseCase";
import type { DeleteEventUseCase } from "../../../application/usecases/events/DeleteEventUseCase";
import type { GetEventsUseCase } from "../../../application/usecases/events/GetEventsUseCase";
import type { UpdateEventUseCase } from "../../../application/usecases/events/UpdateEventUseCase";
import { ValidationError } from "../../../domain/errors/ApplicationError";
import type { GoogleSheetsClient } from "../../../infrastructure/google/GoogleSheetsClient";
import { EventMapper } from "../../../infrastructure/mappers/EventMapper";

interface LegacySheetsControllerDependencies {
  getEventsUseCase: GetEventsUseCase;
  createEventUseCase: CreateEventUseCase;
  updateEventUseCase: UpdateEventUseCase;
  deleteEventUseCase: DeleteEventUseCase;
  googleSheetsClient: GoogleSheetsClient;
}

const isTwoDimensionalArray = (value: unknown): value is string[][] =>
  Array.isArray(value) && value.every((row) => Array.isArray(row));

export class LegacySheetsController {
  constructor(private readonly deps: LegacySheetsControllerDependencies) {}

  readValues = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.deps.getEventsUseCase.execute();
      const header = EventMapper.header();
      const rows = result.results.map((event) => EventMapper.toRow(event));
      res.json({ values: [header, ...rows] });
    } catch (error) {
      next(error);
    }
  };

  appendValues = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { values } = req.body as { values?: unknown };

      if (!isTwoDimensionalArray(values) || values.length === 0) {
        res.status(400).json({ message: "'values' must be a non-empty array" });
        return;
      }

      for (const row of values) {
        const event = EventMapper.toEntity(row);
        if (!event) {
          throw new ValidationError("Invalid event row provided");
        }
        await this.deps.createEventUseCase.execute({ ...event.toPrimitives() });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  updateValues = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { values } = req.body as { values?: unknown };

      if (!isTwoDimensionalArray(values) || values.length === 0) {
        res.status(400).json({ message: "'values' must be a non-empty array" });
        return;
      }

      for (const row of values) {
        const event = EventMapper.toEntity(row);
        if (!event) {
          throw new ValidationError("Invalid event row provided");
        }
        await this.deps.updateEventUseCase.execute(event.id, {
          ...event.toPrimitives(),
        });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  clearValues = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { range } = req.body as { range?: unknown };

      if (typeof range !== "string" || range.trim().length === 0) {
        res.status(400).json({ message: "'range' is required" });
        return;
      }

      const rows = await this.deps.googleSheetsClient.getValues(range);
      const [row] = rows;

      if (!row || !row[0]) {
        res.status(404).json({ message: "Row not found" });
        return;
      }

      await this.deps.deleteEventUseCase.execute(row[0]);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
