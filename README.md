# Eventos

Aplicação web para gestão de eventos, inscrições e presença, com frontend em React + Vite e backend em Node.js + Express (TypeScript, Clean Architecture), persistindo dados em Google Sheets via API.

## Visão geral da arquitetura

- **Frontend** (`src/`): React + TypeScript + Vite
  - Camadas: `domain` → `application` → `infrastructure` → `presentation`
  - Consome a API backend via `src/infrastructure/api/apiClient.ts`
  - Autenticação com tokens JWT e refresh automático em `401`
- **Backend** (`server/`): Express + TypeScript (Clean Architecture)
  - Camadas: `domain` → `application` → `infrastructure` → `presentation`
  - Repositórios Google Sheets e inicialização automática de abas/cabeçalhos
  - Rotas REST sob `/api` + endpoints legados em `/api/sheets/*`

## Pré-requisitos

- Node.js (recomendado: 22+)
- npm
- Docker + VS Code Dev Containers (opcional, recomendado)

## Setup rápido (local)

1. Instale dependências:

   ```bash
   npm install
   cd server && npm install
   ```

2. Configure variáveis de ambiente (seção abaixo).

3. Em terminais separados:

   ```bash
   # backend
   cd server
   npm run dev
   ```

   ```bash
   # frontend (na raiz)
   npm run dev
   ```

4. Acesse:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:4000`
   - Swagger: `http://localhost:4000/api-docs`

## Setup com Dev Container

1. Abra o projeto no VS Code.
2. Execute **Dev Containers: Reopen in Container**.
3. Aguarde o post-create (inclui instalação do Cypress).
4. Configure `.env` e `server/.env`.

## Variáveis de ambiente

### Frontend (`.env` na raiz)

```env
# URL base da API (usada pelo apiClient)
VITE_API_BASE_URL=http://localhost:4000/api

# Legado/compatibilidade (não é a fonte principal no client atual)
VITE_SHEETS_PROXY_URL=http://localhost:4000/api
VITE_GOOGLE_SHEETS_ID=
```

### Backend (`server/.env`)

Copie o exemplo:

```bash
cp server/.env.example server/.env
```

Variáveis obrigatórias para subir o backend:

- `GOOGLE_SHEETS_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

Observação: a chave privada aceita `\n` e é normalizada para quebra de linha real no carregamento.

Para detalhes:

- `docs/SETUP_QUICK_START.md`
- `docs/GOOGLE_SHEETS_SETUP.md`
- `docs/EMAIL_SETUP.md`

## Scripts principais

### Raiz (frontend)

- `npm run dev` — inicia frontend em `5173` (strictPort)
- `npm run build` — build TypeScript + Vite
- `npm run lint` — lint com ESLint
- `npm run test` — sobe frontend e executa Cypress E2E
- `npm run test:open` — abre Cypress UI

### Backend (`server/`)

- `npm run dev` — backend com hot reload (`tsx watch`)
- `npm run build` — compila TypeScript
- `npm run start` — build + execução do backend
- `npm test` — testes de use cases via Cypress

## API e rotas

- Base URL: `/api`
- Recursos REST:
  - `/events`
  - `/users`
  - `/inscriptions`
  - `/presences`
  - `/emails`
- Legado: `/api/sheets/*`

Fonte de verdade para rotas: `server/src/presentation/http/routes/**`.

## Estrutura resumida

- `src/` — frontend
- `server/src/` — backend
- `docs/` — documentação funcional/técnica
- `cypress/` — E2E do frontend
- `server/tests-cypress/` — testes de use cases do backend

## Observações importantes

- O backend falha na inicialização se variáveis Google obrigatórias estiverem ausentes.
- SMTP é opcional: sem configuração, endpoints de e-mail retornam erro explícito de serviço não configurado.
- O frontend deve consumir apenas a API backend (não acessar Google Sheets diretamente).
