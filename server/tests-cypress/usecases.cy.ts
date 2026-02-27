import { createEventUseCaseSpecs } from "./specs/events/CreateEventUseCase.spec";
import { deleteEventUseCaseSpecs } from "./specs/events/DeleteEventUseCase.spec";
import { getEventByIdUseCaseSpecs } from "./specs/events/GetEventByIdUseCase.spec";
import { getEventsUseCaseSpecs } from "./specs/events/GetEventsUseCase.spec";
import { updateEventUseCaseSpecs } from "./specs/events/UpdateEventUseCase.spec";
import { createInscriptionUseCaseSpecs } from "./specs/inscriptions/CreateInscriptionUseCase.spec";
import { getInscriptionsUseCaseSpecs } from "./specs/inscriptions/GetInscriptionsUseCase.spec";
import { createPresenceUseCaseSpecs } from "./specs/presences/CreatePresenceUseCase.spec";
import { getPresencesUseCaseSpecs } from "./specs/presences/GetPresencesUseCase.spec";
import { createUserUseCaseSpecs } from "./specs/users/CreateUserUseCase.spec";
import { deleteUserUseCaseSpecs } from "./specs/users/DeleteUserUseCase.spec";
import { getUserByIdUseCaseSpecs } from "./specs/users/GetUserByIdUseCase.spec";
import { getUsersUseCaseSpecs } from "./specs/users/GetUsersUseCase.spec";
import { updateUserUseCaseSpecs } from "./specs/users/UpdateUserUseCase.spec";
import { registerUseCaseSpecs } from "./utils/registerUseCaseSpecs";

const suites = {
  CreateEventUseCase: createEventUseCaseSpecs,
  DeleteEventUseCase: deleteEventUseCaseSpecs,
  GetEventByIdUseCase: getEventByIdUseCaseSpecs,
  GetEventsUseCase: getEventsUseCaseSpecs,
  UpdateEventUseCase: updateEventUseCaseSpecs,
  CreateUserUseCase: createUserUseCaseSpecs,
  DeleteUserUseCase: deleteUserUseCaseSpecs,
  GetUserByIdUseCase: getUserByIdUseCaseSpecs,
  GetUsersUseCase: getUsersUseCaseSpecs,
  UpdateUserUseCase: updateUserUseCaseSpecs,
  CreateInscriptionUseCase: createInscriptionUseCaseSpecs,
  GetInscriptionsUseCase: getInscriptionsUseCaseSpecs,
  CreatePresenceUseCase: createPresenceUseCaseSpecs,
  GetPresencesUseCase: getPresencesUseCaseSpecs,
} as const;

for (const [suiteName, specMap] of Object.entries(suites)) {
  registerUseCaseSpecs(suiteName, specMap);
}
