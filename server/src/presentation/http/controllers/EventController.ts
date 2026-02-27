import type { NextFunction, Request, Response } from "express";
import { EventDtoMapper } from "../../../application/dtos/EventDtos";
import { parsePaginationParams } from "../../../application/dtos/PaginationDtos";
import type {
  CreateEventPayload,
  CreateEventUseCase,
} from "../../../application/usecases/events/CreateEventUseCase";
import type { DeleteEventUseCase } from "../../../application/usecases/events/DeleteEventUseCase";
import type { GetEventByIdUseCase } from "../../../application/usecases/events/GetEventByIdUseCase";
import type { GetEventsUseCase } from "../../../application/usecases/events/GetEventsUseCase";
import type {
  UpdateEventPayload,
  UpdateEventUseCase,
} from "../../../application/usecases/events/UpdateEventUseCase";

interface EventControllerDependencies {
  getEventsUseCase: GetEventsUseCase;
  getEventByIdUseCase: GetEventByIdUseCase;
  createEventUseCase: CreateEventUseCase;
  updateEventUseCase: UpdateEventUseCase;
  deleteEventUseCase: DeleteEventUseCase;
}

export class EventController {
  constructor(private readonly deps: EventControllerDependencies) {}

  list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const pagination = parsePaginationParams(
        req.query.page as string,
        req.query.limit as string
      );
      const result = await this.deps.getEventsUseCase.execute(pagination);
      res.json({
        results: result.results.map((event) =>
          EventDtoMapper.toResponse(event)
        ),
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  };

  listAll = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const events = await this.deps.getEventsUseCase.executeAll();
      res.json(events.map((event) => EventDtoMapper.toResponse(event)));
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const event = await this.deps.getEventByIdUseCase.execute(req.params.id);
      res.json(EventDtoMapper.toResponse(event));
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const payload = req.body as CreateEventPayload;
      const event = await this.deps.createEventUseCase.execute(payload);
      res.status(201).json(EventDtoMapper.toResponse(event));
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const payload = req.body as UpdateEventPayload;
      const event = await this.deps.updateEventUseCase.execute(
        req.params.id,
        payload
      );
      res.json(EventDtoMapper.toResponse(event));
    } catch (error) {
      next(error);
    }
  };

  remove = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.deps.deleteEventUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
