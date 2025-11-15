import type { NextFunction, Request, Response } from "express";
import { PresenceDtoMapper } from "../../../application/dtos/PresenceDtos";
import { parsePaginationParams } from "../../../application/dtos/PaginationDtos";
import type {
  CreatePresencePayload,
  CreatePresenceUseCase,
} from "../../../application/usecases/presences/CreatePresenceUseCase";
import type {
  DeletePresenceUseCase,
} from "../../../application/usecases/presences/DeletePresenceUseCase";
import type {
  GetPresenceByIdUseCase,
} from "../../../application/usecases/presences/GetPresenceByIdUseCase";
import type {
  GetPresencesUseCase,
} from "../../../application/usecases/presences/GetPresencesUseCase";

interface PresenceControllerDependencies {
  getPresencesUseCase: GetPresencesUseCase;
  getPresenceByIdUseCase: GetPresenceByIdUseCase;
  createPresenceUseCase: CreatePresenceUseCase;
  deletePresenceUseCase: DeletePresenceUseCase;
}

export class PresenceController {
  constructor(private readonly deps: PresenceControllerDependencies) {}

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
      const result = await this.deps.getPresencesUseCase.execute(pagination);
      res.json({
        results: result.results.map((presence) =>
          PresenceDtoMapper.toResponse(presence)
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
      const presences = await this.deps.getPresencesUseCase.executeAll();
      res.json(
        presences.map((presence) => PresenceDtoMapper.toResponse(presence))
      );
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
      const presence = await this.deps.getPresenceByIdUseCase.execute(
        req.params.id
      );
      res.json(PresenceDtoMapper.toResponse(presence));
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
      const payload = req.body as CreatePresencePayload;
      const presence = await this.deps.createPresenceUseCase.execute(payload);
      res.status(201).json(PresenceDtoMapper.toResponse(presence));
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
      await this.deps.deletePresenceUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

