# Eventos

## Getting Started

This project uses **Dev Containers** for a consistent development environment. You can develop either using the dev container (recommended) or locally.

### Option 1: Using Dev Container (Recommended)

The project includes a fully configured dev container with all dependencies and tools pre-installed.

#### Prerequisites

- [Docker](https://www.docker.com/get-started) installed and running
- [VS Code](https://code.visualstudio.com/) with the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) installed

#### Setup

1. **Open the project in VS Code**

   ```bash
   code .
   ```

2. **Reopen in Container**

   - When prompted, click "Reopen in Container"
   - Or use the command palette: `F1` → `Dev Containers: Reopen in Container`
   - The container will build automatically (this may take a few minutes on first run)

3. **Wait for post-create setup**

   - The container will automatically run `npx cypress install` after creation
   - Dependencies are installed via Docker Compose

4. **Configure environment variables**

   - Create `.env` file in the project root (see [Environment Variables](#environment-variables) section)
   - For the server, copy `server/.env.example` to `server/.env` and configure it

5. **Start development**
   - The dev container includes VS Code extensions for React, TypeScript, ESLint, Prettier, Git, and more
   - All tools are pre-configured and ready to use

#### Dev Container Features

- **Pre-installed tools**: Node.js, npm, Cypress, and all project dependencies
- **VS Code extensions**: React snippets, ESLint, Prettier, GitLens, and more
- **Auto-formatting**: Code is automatically formatted on save
- **Shell**: Zsh with plugins for better terminal experience
- **Port forwarding**: Automatically configured for the development server

### Option 2: Local Development

If you prefer to develop locally without Docker:

## Local Development

1. **Install dependencies** for both the Vite app and the Sheets proxy:

   ```bash
   npm install
   cd server && npm install
   ```

2. **Configure environment variables** (see [Environment Variables](#environment-variables) section below)

3. **Start the back-end proxy** (Clean Architecture service):

   ```bash
   cd server
   # For development (with hot reload)
   npm run dev

   # OR for production-like run
   npm run start
   ```

   The server will run on `http://localhost:4000`

4. **Start the front-end**:
   ```bash
   # From project root
   npm run dev
   ```

## Environment Variables

### Front-end (`.env` in project root)

Create a `.env` file with:

```env
VITE_GOOGLE_SHEETS_ID=your-spreadsheet-id-here
VITE_SHEETS_PROXY_URL=http://localhost:4000/api
```

### Back-end (`server/.env`)

1. Copy the example file:

   ```bash
   cp server/.env.example server/.env
   ```

2. Fill in your configuration:
   - Google Sheets ID (same as front-end)
   - Per-entity sheet ranges (events, users, inscriptions, presences)
   - Service account credentials
   - **Important**: Keep newline characters in the private key (replace literal `\n` sequences with real newlines if necessary)

For detailed Google Sheets setup instructions, see [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)

## Project Structure

### Front-end

- **Domain layer** (`src/domain`): Core business entities and repository interfaces
- **Application layer** (`src/application`): Business logic and use cases
- **Infrastructure layer** (`src/infrastructure`): Google Sheets API client and repository implementations
- **Presentation layer** (`src/presentation`): React hooks and UI components

### Back-end

- **Domain layer** (`server/src/domain`): Models `Event`, `User`, `Inscription`, and `Presence` entities plus repository contracts
- **Application layer** (`server/src/application`): Use cases such as listing, creating, updating, and deleting events
- **Infrastructure layer** (`server/src/infrastructure`): Google Sheets gateway and repositories
- **Presentation layer** (`server/src/presentation`): Express controllers/routes for both REST (`/api/events`) and legacy Sheets-compatible endpoints (`/api/sheets/*`)
- **Container** (`server/src/container`): Dependency injection wiring
- **Main** (`server/src/main.ts`): HTTP app bootstrap

## Available Scripts

### Front-end

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run Cypress tests
- `npm run test:open` - Open Cypress Test Runner

### Back-end

- `cd server && npm run dev` - Start development server with hot reload
- `cd server && npm run start` - Build and start production server
- `cd server && npm run build` - Build TypeScript to JavaScript

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
