# Copilot Instructions for `eventos`

## Project shape (full-stack monorepo)

- Root (`src/`) is a React + Vite frontend (TypeScript).
- `server/` is a Node.js + Express backend (TypeScript) using Clean Architecture.
- Primary persistence is Google Sheets via backend repositories; frontend should call backend API, not Sheets directly.

## Architecture and boundaries

- Backend layers are explicit: `domain` → `application` → `infrastructure` → `presentation`.
- Add business rules in use cases (`server/src/application/usecases/**`), not controllers.
- Controllers should map HTTP ↔ DTOs only (example: `server/src/presentation/http/controllers/EventController.ts`).
- Repository implementations live in `server/src/infrastructure/repositories/**`; contracts are in `server/src/domain/repositories/**`.
- Dependency wiring is centralized in `server/src/container/index.ts` (`buildContainer`).

## Data flow to know before coding

- On backend startup, `buildContainer()` initializes each Google Sheet and validates headers.
- Sheet auto-bootstrap behavior is implemented in `server/src/infrastructure/google/SheetInitializer.ts`.
- Events/users/inscriptions/presences ranges come from `environment.googleSheets.ranges` in `server/src/config/environment.ts`.
- Frontend API calls go through `src/infrastructure/api/apiClient.ts` with automatic JWT refresh on `401`.
- Auth state is managed in `src/presentation/contexts/AuthProvider.tsx`; tokens are in `localStorage` via `tokenStorage`.

## API and routing conventions

- API base is `/api`; route registration is in `server/src/presentation/http/routes/index.ts`.
- Resource routes are RESTful (`/events`, `/users`, `/inscriptions`, `/presences`, `/emails`).
- Most resource routes apply `authMiddleware`; keep this behavior consistent when adding protected endpoints.
- Legacy compatibility endpoints exist under `/api/sheets/*` (`legacySheetsRoutes.ts`) — avoid expanding legacy surface unless required.

## Error and DTO patterns

- Throw domain/application errors using `ApplicationError` subclasses (`ValidationError`, `NotFoundError`, `UnauthorizedError`).
- Let `errorHandler` (`server/src/presentation/http/middlewares/errorHandler.ts`) format HTTP error responses.
- Use DTO mappers in `server/src/application/dtos/**` for response/request shaping and pagination.

## Build/test workflows

- Frontend dev: `npm run dev` (port `5173`, strict port).
- Backend dev: `cd server && npm run dev` (port `4000` by default).
- Frontend e2e: `npm test` (runs Vite + Cypress via `start-server-and-test`).
- Backend use-case tests: `cd server && npm test` (Cypress config at `server/cypress.config.ts`, specs in `server/tests-cypress/**`).
- Swagger UI is served at `/api-docs` when backend is running.

## Environment and integration gotchas

- Backend hard-fails at startup if Google env vars are missing: `GOOGLE_SHEETS_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`.
- Private key normalization (`\\n` → newline) happens in `server/src/config/environment.ts`; keep this behavior.
- SMTP is optional; if not configured, email use case is wired to a disabled mail client that throws clear errors.
- Docs can lag code (e.g., some docs mention `/api/email/send`), so treat `server/src/presentation/http/routes/**` as source of truth.

## Frontend conventions in this repo

- Keep data access centralized through hooks/services (`src/presentation/hooks/useEventService.ts`, `src/application/services/EventService.ts`).
- Prefer existing `apiClient` helpers over raw `fetch` calls in components.
- Keep UI/auth state in context/hooks; components like `src/presentation/components/Login.tsx` remain presentation-focused.
