import { CreateEventUseCase } from "../application/usecases/events/CreateEventUseCase";
import { DeleteEventUseCase } from "../application/usecases/events/DeleteEventUseCase";
import { GetEventByIdUseCase } from "../application/usecases/events/GetEventByIdUseCase";
import { GetEventsUseCase } from "../application/usecases/events/GetEventsUseCase";
import { UpdateEventUseCase } from "../application/usecases/events/UpdateEventUseCase";
import { CreateUserUseCase } from "../application/usecases/users/CreateUserUseCase";
import { DeleteUserUseCase } from "../application/usecases/users/DeleteUserUseCase";
import { GetUserByIdUseCase } from "../application/usecases/users/GetUserByIdUseCase";
import { GetUsersUseCase } from "../application/usecases/users/GetUsersUseCase";
import { UpdateUserUseCase } from "../application/usecases/users/UpdateUserUseCase";
import { environment } from "../config/environment";
import { GoogleSheetsClient } from "../infrastructure/google/GoogleSheetsClient";
import { GoogleSheetsEventRepository } from "../infrastructure/repositories/GoogleSheetsEventRepository";
import { GoogleSheetsUserRepository } from "../infrastructure/repositories/GoogleSheetsUserRepository";
import { EventController } from "../presentation/http/controllers/EventController";
import { LegacySheetsController } from "../presentation/http/controllers/LegacySheetsController";
import { UserController } from "../presentation/http/controllers/UserController";

export interface ApplicationContainer {
  controllers: {
    eventController: EventController;
    userController: UserController;
    legacySheetsController: LegacySheetsController;
  };
}

export const buildContainer = (): ApplicationContainer => {
  const googleSheetsClient = new GoogleSheetsClient(environment.googleSheets);

  const eventRepository = new GoogleSheetsEventRepository(googleSheetsClient, {
    range: environment.googleSheets.ranges.events,
  });

  const getEventsUseCase = new GetEventsUseCase(eventRepository);
  const getEventByIdUseCase = new GetEventByIdUseCase(eventRepository);
  const createEventUseCase = new CreateEventUseCase(eventRepository);
  const updateEventUseCase = new UpdateEventUseCase(eventRepository);
  const deleteEventUseCase = new DeleteEventUseCase(eventRepository);

  const userRepository = new GoogleSheetsUserRepository(googleSheetsClient, {
    range: environment.googleSheets.ranges.users,
  });

  const getUsersUseCase = new GetUsersUseCase(userRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  const createUserUseCase = new CreateUserUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);

  const eventController = new EventController({
    getEventsUseCase,
    getEventByIdUseCase,
    createEventUseCase,
    updateEventUseCase,
    deleteEventUseCase,
  });

  const userController = new UserController({
    getUsersUseCase,
    getUserByIdUseCase,
    createUserUseCase,
    updateUserUseCase,
    deleteUserUseCase,
  });

  const legacySheetsController = new LegacySheetsController({
    getEventsUseCase,
    createEventUseCase,
    updateEventUseCase,
    deleteEventUseCase,
    googleSheetsClient,
  });

  return {
    controllers: {
      eventController,
      userController,
      legacySheetsController,
    },
  };
};
