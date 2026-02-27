import type { NextFunction, Request, Response } from "express";
import { InscriptionDtoMapper } from "../../../application/dtos/InscriptionDtos";
import { parsePaginationParams } from "../../../application/dtos/PaginationDtos";
import type {
  CreateInscriptionPayload,
  CreateInscriptionUseCase,
} from "../../../application/usecases/inscriptions/CreateInscriptionUseCase";
import type {
  DeleteInscriptionUseCase,
} from "../../../application/usecases/inscriptions/DeleteInscriptionUseCase";
import type {
  GetInscriptionByIdUseCase,
} from "../../../application/usecases/inscriptions/GetInscriptionByIdUseCase";
import type {
  GetInscriptionsUseCase,
} from "../../../application/usecases/inscriptions/GetInscriptionsUseCase";
import type {
  UpdateInscriptionPayload,
  UpdateInscriptionUseCase,
} from "../../../application/usecases/inscriptions/UpdateInscriptionUseCase";

interface InscriptionControllerDependencies {
  getInscriptionsUseCase: GetInscriptionsUseCase;
  getInscriptionByIdUseCase: GetInscriptionByIdUseCase;
  createInscriptionUseCase: CreateInscriptionUseCase;
  updateInscriptionUseCase: UpdateInscriptionUseCase;
  deleteInscriptionUseCase: DeleteInscriptionUseCase;
}

export class InscriptionController {
  constructor(private readonly deps: InscriptionControllerDependencies) {}

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
      const result = await this.deps.getInscriptionsUseCase.execute(pagination);
      res.json({
        results: result.results.map((inscription) =>
          InscriptionDtoMapper.toResponse(inscription)
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
      const inscriptions =
        await this.deps.getInscriptionsUseCase.executeAll();
      res.json(
        inscriptions.map((inscription) =>
          InscriptionDtoMapper.toResponse(inscription)
        )
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
      const inscription = await this.deps.getInscriptionByIdUseCase.execute(
        req.params.id
      );
      res.json(InscriptionDtoMapper.toResponse(inscription));
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
      const payload = req.body as CreateInscriptionPayload;
      const inscription =
        await this.deps.createInscriptionUseCase.execute(payload);
      res.status(201).json(InscriptionDtoMapper.toResponse(inscription));
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
      const payload = req.body as UpdateInscriptionPayload;
      const inscription = await this.deps.updateInscriptionUseCase.execute(
        req.params.id,
        payload
      );
      res.json(InscriptionDtoMapper.toResponse(inscription));
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
      await this.deps.deleteInscriptionUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

