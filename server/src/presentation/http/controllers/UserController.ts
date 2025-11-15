import type { NextFunction, Request, Response } from "express";
import { UserDtoMapper } from "../../../application/dtos/UserDtos";
import type {
  CreateUserPayload,
  CreateUserUseCase,
} from "../../../application/usecases/users/CreateUserUseCase";
import type { DeleteUserUseCase } from "../../../application/usecases/users/DeleteUserUseCase";
import type { GetUserByIdUseCase } from "../../../application/usecases/users/GetUserByIdUseCase";
import type { GetUsersUseCase } from "../../../application/usecases/users/GetUsersUseCase";
import type {
  UpdateUserPayload,
  UpdateUserUseCase,
} from "../../../application/usecases/users/UpdateUserUseCase";

interface UserControllerDependencies {
  getUsersUseCase: GetUsersUseCase;
  getUserByIdUseCase: GetUserByIdUseCase;
  createUserUseCase: CreateUserUseCase;
  updateUserUseCase: UpdateUserUseCase;
  deleteUserUseCase: DeleteUserUseCase;
}

export class UserController {
  constructor(private readonly deps: UserControllerDependencies) {}

  list = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await this.deps.getUsersUseCase.execute();
      res.json(users.map((user) => UserDtoMapper.toResponse(user)));
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
      const user = await this.deps.getUserByIdUseCase.execute(req.params.id);
      res.json(UserDtoMapper.toResponse(user));
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
      const payload = req.body as CreateUserPayload;
      const user = await this.deps.createUserUseCase.execute(payload);
      res.status(201).json(UserDtoMapper.toResponse(user));
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
      const payload = req.body as UpdateUserPayload;
      const user = await this.deps.updateUserUseCase.execute(
        req.params.id,
        payload
      );
      res.json(UserDtoMapper.toResponse(user));
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
      await this.deps.deleteUserUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
