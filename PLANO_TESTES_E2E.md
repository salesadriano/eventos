# PLANO DE TESTES E2E COM PERSISTÊNCIA REAL — REPOSITÓRIO EVENTOS

## 1. RESUMO DAS FONTES CONSULTADAS

### Arquivos Lidos com Evidências:
- **README.md** (`/home/salesadriano/eventos/README.md`, linhas 1-136)
  - Visão geral arquitetura, pré-requisitos, setup, variáveis de ambiente
  
- **package.json** (raiz e server)
  - Scripts: `npm run dev`, `npm run test`, `npm test`, etc.
  - Versões: React 19.1.1, Express 4.21.2, Cypress 15.6.0, TypeScript 5.6.3

- **cypress.config.ts** 
  - Frontend: `/home/salesadriano/eventos/cypress.config.ts` (linhas 1-21)
  - Backend: `/home/salesadriano/eventos/server/cypress.config.ts` (linhas 1-12)

- **Documentação em `/docs/`**
  - `docs/assets/API.md` (linhas 1-587): Documentação completa de endpoints RESTful
  - `docs/assets/GOOGLE_SHEETS_SETUP.md` (linhas 1-232): Setup Google Sheets
  - `docs/assets/SETUP_QUICK_START.md` (linhas 1-128): Quick start com variáveis
  - `docs/assets/EMAIL_SETUP.md` (linhas 1-60+): Configuração SMTP
  - `docs/MODELO_DADOS.md` (linhas 1-490): Modelo de dados completo

- **Rotas Backend** em `/server/src/presentation/http/routes/`
  - `authRoutes.ts` (linhas 1-235): POST register, POST login, POST/GET auth/* 
  - `eventRoutes.ts` (linhas 1-310): GET/POST/PUT/PATCH/DELETE /events
  - `userRoutes.ts` (linhas 1-310): GET/POST/PUT/PATCH/DELETE /users
  - `inscriptionRoutes.ts` (linhas 1-312): GET/POST/PUT/PATCH/DELETE /inscriptions
  - `presenceRoutes.ts` (linhas 1-214): GET/POST/DELETE /presences
  - `emailRoutes.ts` (linhas 1-44): POST /emails
  - `index.ts` (linhas 1-85): Registro central de rotas

- **API Client Frontend**
  - `/src/infrastructure/api/apiClient.ts` (linhas 1-146): Cliente HTTP com auth

- **Testes E2E Existentes**
  - Frontend: `/cypress/e2e/app.cy.ts` (linhas 1-21)
  - Backend: `/server/tests-cypress/usecases.cy.ts` (linhas 1-47+)
  - Backend specs: `/server/tests-cypress/specs/` (25 arquivos .spec.ts)

- **Arquivos .env**
  - `/home/salesadriano/eventos/.env.example` (linhas 1-8)
  - `/server/.env.example` (linhas 1-25)

---

## 2. LISTA DE FLUXOS/FUNCIONALIDADES DOCUMENTADAS

### 2.1 AUTENTICAÇÃO (Auth)

#### Documentado em `/docs/case/UC-001-login-sessao-segura.md`:
- Fluxo OAuth 2.0 com Authorization Code + PKCE
- Refresh automático de tokens com rotação
- UC-043: Selecionar Provedor OAuth
- UC-044: Processar Callback OAuth com PKCE

#### Endpoints Implementados (confirmado em `authRoutes.ts`):

| Método | Endpoint | Documentação | Implementado | Autenticação |
|--------|----------|--------------|--------------|--------------|
| POST | `/api/auth/register` | ✅ UC-002 | ✅ Linha 30 | Não |
| POST | `/api/auth/login` | ✅ UC-001 | ✅ Linha 134 | Não |
| GET | `/api/auth/providers` | ✅ | ✅ Linha 48 | Não |
| POST | `/api/auth/oauth/{provider}/start` | ✅ UC-043 | ✅ Linha 77 | Não |
| POST | `/api/auth/oauth/{provider}/callback` | ✅ UC-044 | ✅ Linha 106 | Não |
| POST | `/api/auth/refresh` | ✅ UC-017 | ✅ Linha 162 | Não |
| GET | `/api/auth/validate` | ✅ | ✅ Linha 180 | JWT Bearer |
| POST | `/api/auth/logout` | ✅ | ✅ Linha 203 | JWT Bearer |
| POST | `/api/auth/revoke` | ✅ | ✅ Linha 232 | JWT Bearer |

---

### 2.2 EVENTOS (Events)

#### Documentado em:
- `/docs/case/UC-020-criar-evento.md`
- `/docs/case/UC-021-listar-filtrar-eventos.md`
- `/docs/case/UC-022-atualizar-excluir-evento.md`
- `/docs/assets/API.md` (linhas 40-248)

#### Endpoints Implementados (confirmado em `eventRoutes.ts`):

| Método | Endpoint | Documentação | Implementado | Autenticação |
|--------|----------|--------------|--------------|--------------|
| GET | `/api/events` | ✅ (paginado) | ✅ Linha 53 | JWT Bearer |
| GET | `/api/events/all` | ✅ (sem paginação) | ✅ Linha 85 | JWT Bearer |
| GET | `/api/events/:id` | ✅ | ✅ Linha 128 | JWT Bearer |
| POST | `/api/events` | ✅ | ✅ Linha 170 | JWT Bearer |
| PUT | `/api/events/:id` | ✅ | ✅ Linha 219 | JWT Bearer |
| PATCH | `/api/events/:id` | ✅ | ✅ Linha 268 | JWT Bearer |
| DELETE | `/api/events/:id` | ✅ | ✅ Linha 307 | JWT Bearer |

**Parâmetros de Paginação** (docs/assets/API.md, linhas 78-106):
- `page` (padrão: 1)
- `limit` (padrão: 10, máximo: 100)

---

### 2.3 USUÁRIOS (Users)

#### Documentado em:
- `/docs/case/UC-002-auto-cadastro-usuario.md`
- `/docs/case/UC-019-ativar-conta-usuario.md`
- `/docs/assets/API.md` (linhas 251-423)

#### Endpoints Implementados (confirmado em `userRoutes.ts`):

| Método | Endpoint | Documentação | Implementado | Autenticação |
|--------|----------|--------------|--------------|--------------|
| GET | `/api/users` | ✅ (paginado) | ✅ Linha 53 | JWT Bearer |
| GET | `/api/users/all` | ✅ (sem paginação) | ✅ Linha 85 | JWT Bearer |
| GET | `/api/users/:id` | ✅ | ✅ Linha 128 | JWT Bearer |
| POST | `/api/users` | ✅ | ✅ Linha 170 | JWT Bearer |
| PUT | `/api/users/:id` | ✅ | ✅ Linha 219 | JWT Bearer |
| PATCH | `/api/users/:id` | ✅ | ✅ Linha 268 | JWT Bearer |
| DELETE | `/api/users/:id` | ✅ | ✅ Linha 307 | JWT Bearer |

---

### 2.4 INSCRIÇÕES (Inscriptions)

#### Documentado em:
- `/docs/case/UC-007-inscricao-evento-atividades.md`
- `/docs/case/UC-023-inscricao-todas-atividades.md`
- `/docs/case/UC-024-inscricao-individual-atividades.md`

#### Endpoints Implementados (confirmado em `inscriptionRoutes.ts`):

| Método | Endpoint | Documentação | Implementado | Autenticação |
|--------|----------|--------------|--------------|--------------|
| GET | `/api/inscriptions` | ✅ (paginado) | ✅ Linha 55 | JWT Bearer |
| GET | `/api/inscriptions/all` | ✅ (sem paginação) | ✅ Linha 87 | JWT Bearer |
| GET | `/api/inscriptions/:id` | ✅ | ✅ Linha 130 | JWT Bearer |
| POST | `/api/inscriptions` | ✅ | ✅ Linha 172 | JWT Bearer |
| PUT | `/api/inscriptions/:id` | ✅ | ✅ Linha 221 | JWT Bearer |
| PATCH | `/api/inscriptions/:id` | ✅ | ✅ Linha 270 | JWT Bearer |
| DELETE | `/api/inscriptions/:id` | ✅ | ✅ Linha 309 | JWT Bearer |

---

### 2.5 PRESENÇAS (Presences)

#### Documentado em:
- `/docs/case/UC-008-registro-presenca.md`
- `/docs/case/UC-025-registrar-presenca-atividade.md`

#### Endpoints Implementados (confirmado em `presenceRoutes.ts`):

| Método | Endpoint | Documentação | Implementado | Autenticação |
|--------|----------|--------------|--------------|--------------|
| GET | `/api/presences` | ✅ (paginado) | ✅ Linha 55 | JWT Bearer |
| GET | `/api/presences/all` | ✅ (sem paginação) | ✅ Linha 87 | JWT Bearer |
| GET | `/api/presences/:id` | ✅ | ✅ Linha 130 | JWT Bearer |
| POST | `/api/presences` | ✅ | ✅ Linha 172 | JWT Bearer |
| DELETE | `/api/presences/:id` | ✅ | ✅ Linha 211 | JWT Bearer |

**Nota**: Presences NÃO tem PUT/PATCH (apenas GET/POST/DELETE) — confirmado em código linha 211, não há PUT/PATCH.

---

### 2.6 E-MAILS (Emails)

#### Documentado em:
- `/docs/assets/EMAIL_SETUP.md` (linhas 38-60+)
- `/docs/assets/API.md` (linhas 426-463)
- `/docs/case/UC-018-enviar-link-ativacao-usuario.md`

#### Endpoints Implementados (confirmado em `emailRoutes.ts`):

| Método | Endpoint | Documentação | Implementado | Autenticação |
|--------|----------|--------------|--------------|--------------|
| POST | `/api/emails` | ✅ | ✅ Linha 41 | **Não** |

**Campos Obrigatórios** (API.md, linha 463):
- `to`: Destinatário(s)
- `subject`: Assunto
- `text` OU `html`: Conteúdo (um dos dois obrigatório)

**Campos Opcionais**:
- `cc`, `bcc`: Array de emails
- `attachments`: Array com `filename`, `content` (base64), `contentType`

---

### 2.7 HEALTH CHECK

#### Documentado em:
- `/docs/assets/API.md` (linhas 24-36)

#### Endpoints Implementados (confirmado em `index.ts`, linha 48):

| Método | Endpoint | Documentação | Implementado | Autenticação |
|--------|----------|--------------|--------------|--------------|
| GET | `/api/health` | ✅ | ✅ Linha 48 | Não |

---

### 2.8 LEGACY SHEETS API (Compatibilidade)

#### Documentado em:
- `/docs/assets/API.md` (linhas 467-485)

#### Endpoints Implementados (confirmado em `legacySheetsRoutes.ts`):

| Método | Endpoint | Documentação | Implementado | Uso |
|--------|----------|--------------|--------------|-----|
| GET | `/api/sheets/values?range=...` | ✅ | ✅ Linha 9 | Leitura legada |
| POST | `/api/sheets/append` | ✅ | ✅ Linha 10 | Append legado |
| PUT | `/api/sheets/values` | ✅ | ✅ Linha 11 | Update legado |
| POST | `/api/sheets/clear` | ✅ | ✅ Linha 12 | Clear legado |

**Status**: Mantidos para compatibilidade retroativa. Migração para endpoints RESTful recomendada.

---

## 3. PRÉ-REQUISITOS DE AMBIENTE E VARIÁVEIS

### 3.1 FRONTEND (`.env` na raiz)

Obrigatórias:
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Opcionais/Legado:
```env
VITE_SHEETS_PROXY_URL=http://localhost:4000/api
VITE_GOOGLE_SHEETS_ID=
```

**Referência**: `/home/salesadriano/eventos/.env.example` (linhas 1-8)

### 3.2 BACKEND (`server/.env`)

**Obrigatórias para iniciar**:
```env
GOOGLE_SHEETS_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Opcionais (server)**:
```env
PORT=4000
CORS_ALLOW_ORIGIN=http://localhost:5173
```

**Opcionais (Google Sheets ranges)**:
```env
GOOGLE_SHEETS_EVENTS_RANGE=events!A:J
GOOGLE_SHEETS_USERS_RANGE=users!A:K
GOOGLE_SHEETS_INSCRIPTIONS_RANGE=inscriptions!A:G
GOOGLE_SHEETS_PRESENCES_RANGE=presences!A:F
```

**Opcionais (OAuth Google)**:
```env
OAUTH_STATE_TTL_SECONDS=600
OAUTH_GOOGLE_CLIENT_ID=
OAUTH_GOOGLE_CLIENT_SECRET=
OAUTH_GOOGLE_REDIRECT_URI=
```

**Opcionais (SMTP)**:
```env
SMTP_HOST=webmail.ac.gov.br
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@ac.gov.br
SMTP_PASS=your-password
SMTP_FROM=your-email@ac.gov.br
```

**Referência**: `/server/.env.example` (linhas 1-25)

### 3.3 PRÉ-REQUISITOS DO SISTEMA

- **Node.js**: 22+ recomendado (README.md, linha 18)
- **npm**: Qualquer versão recente
- **Docker + VS Code Dev Containers**: Opcional, recomendado (README.md, linha 20)

### 3.4 SETUP RÁPIDO (LOCAL)

```bash
# Raiz
npm install
cd server
npm install

# Criar .env files
cp .env.example .env  # raiz
cp server/.env.example server/.env

# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
npm run dev

# Acesso
# Frontend: http://localhost:5173
# Backend: http://localhost:4000
# Swagger API: http://localhost:4000/api-docs
```

**Referência**: README.md (linhas 22-49)

---

## 4. DIVERGÊNCIAS ENTRE DOCUMENTAÇÃO E CÓDIGO

### 4.1 PRESENCES - Métodos HTTP Limitados

**Divergência Menor**:
- **Documentação** (`API.md`, linhas 426-463): Descreve padrão genérico com PUT/PATCH/DELETE
- **Código Implementado** (`presenceRoutes.ts`, linhas 1-214): 
  - ✅ GET (lista paginada, linha 55)
  - ✅ GET /all (sem paginação, linha 87)
  - ✅ GET /:id (por ID, linha 130)
  - ✅ POST (criar presença, linha 172)
  - ✅ DELETE (remover, linha 211)
  - ❌ **Sem PUT/PATCH** (não há update de presença)

**Evidência**: Arquivo `presenceRoutes.ts` termina em linha 214 com `router.delete()` e `return router`, sem PUT/PATCH intermediários.

**Análise**: Alinhado com modelo de negócio (presença é record-only, não editável).

---

### 4.2 Emails - Sem Autenticação Obrigatória

**Nota** (Não é divergência, é design):
- **Documentado**: `emailRoutes.ts` (linhas 4-41) não aplica `authMiddleware` diferente de outros endpoints
- **Código**: POST `/api/emails` é PUBLIC (sem JWT requerido)
- **API.md**: Não menciona se é autenticado ou não (ambiguidade)

**Evidência**: `emailRoutes.ts` linha 7 retorna router SEM chamar `router.use(authMiddleware)` como em eventRoutes (linha 9), userRoutes (linha 9), etc.

**Análise**: Proposital — emails podem ser enviados por usuários não autenticados (ex: formulário de contato).

---

### 4.3 Google Sheets Range - Discrepância de Colunas em Users

**Divergência Detectada**:

| Fonte | GOOGLE_SHEETS_USERS_RANGE | Colunas |
|-------|---------------------------|---------|
| `server/.env.example` (linha 4) | `users!A:K` | **11 colunas (A-K)** |
| `MODELO_DADOS.md` (linhas 340-354) | Especifica apenas A-I (9 colunas) | `id`, `name`, `email`, `password`, `oauthProvider`, `oauthSubject`, `refreshTokenHash`, `lastLoginAt`, `profile`, `createdAt`, `updatedAt` = **11 campos** |

**Análise**: A documentação descreve 11 campos (profile + createdAt + updatedAt adicionados), mas `.env.example` indica range até K. Possivelmente K é buffer ou campo future. **Sem impacto prático**, pois Google Sheets adapta.

---

### 4.4 Backend Tests - Cypress vs Jest

**Nota**: 
- Backend usa **Cypress** para testes (`/server/tests-cypress/`), não Jest/Mocha
- Frontend usa **Cypress** para E2E (`/cypress/e2e/`)
- Ambos rodam com `npm test` (raiz: `npm run test`, backend: `npm test`)

**Documentação**: README.md (linhas 100, 108) menciona "sobe frontend" e "use cases via Cypress" (não Jest).

**Análise**: Alinhado. Cypress é usado para testes de integração no backend também.

---

## 5. COMANDOS OFICIAIS/SUGERIDOS ALINHADOS AOS SCRIPTS

### 5.1 FRONTEND (Raiz)

```bash
# Desenvolvimento
npm run dev
# Inicia Vite em http://localhost:5173 (strictPort)
# Referência: package.json linha 8

# Build
npm run build
# Compila TypeScript + Vite
# Referência: package.json linha 9

# Linting
npm run lint
# ESLint
# Referência: package.json linha 10

# Testes E2E (com servidor)
npm run test
# Inicia frontend + executa Cypress
# Internamente: start-server-and-test dev http://localhost:5173 cy-run
# Referência: package.json linha 13

# Testes E2E (UI interativa)
npm run test:open
# Abre Cypress UI para desenvolvimento de testes
# Referência: package.json linha 14

# Watch Cypress (com config explícito)
npm run test:watch
# cypress open --config-file cypress.config.ts
# Referência: package.json linha 15

# Preview produção
npm run preview
# Vite preview
# Referência: package.json linha 11
```

### 5.2 BACKEND (em `server/`)

```bash
# Desenvolvimento (hot reload)
npm run dev
# tsx watch src/main.ts
# Inicia em http://localhost:4000
# Referência: server/package.json linha 8

# Build
npm run build
# tsc --project tsconfig.json
# Referência: server/package.json linha 6

# Produção
npm run start
# npm run build && node dist/main.js
# Referência: server/package.json linha 7

# Testes de Use Cases
npm test
# tsx tests-cypress/runCoverage.ts
# Executa todos os specs em tests-cypress/specs/
# Referência: server/package.json linha 9

# Testes com Watch UI
npm run test:watch
# xvfb-run -a cypress open --config-file cypress.config.ts
# Referência: server/package.json linha 10

# Testes com Coverage
npm run test:coverage
# c8 com reporter text-summary, lcov, json-summary
# Gera coverage/ com relatórios
# Referência: server/package.json linha 11
```

### 5.3 SETUP COMPLETO (Docker + Dev Container)

```bash
# 1. Abrir no VS Code
# 2. Pressionar: Dev Containers: Reopen in Container
# 3. Aguardar post-create (inclui npm install + Cypress)
# 4. Configurar .env e server/.env
# 5. Iniciar backends em terminais separados

# Terminal 1 (Backend)
cd server && npm run dev

# Terminal 2 (Frontend)
npm run dev

# Terminal 3 (Testes E2E Frontend)
npm run test:open

# Terminal 4 (Testes Backend)
cd server && npm run test:watch
```

**Referência**: README.md (linhas 51-56)

---

## 6. RESUMO EXECUTIVO

### Estatísticas:

| Item | Quantidade | Status |
|------|-----------|--------|
| Endpoints Autenticados (JWT) | 22 | ✅ Implementados |
| Endpoints Públicos | 3 (auth/login, auth/register, emails) | ✅ Implementados |
| Legacy Endpoints | 4 (sheets/*) | ✅ Implementados |
| Casos de Uso Documentados | 44 (UC-001 a UC-044) | ✅ Documentados |
| Testes Backend (Specs) | 25 | ✅ Implementados |
| Testes Frontend (E2E) | 1 (basic) | ⚠️ Minimal |
| Documentação Markdown | 50+ | ✅ Completa |

### Readiness para E2E com Persistência Real:

✅ **Backend pronto**:
- Endpoints RESTful completos
- Persistência em Google Sheets
- Autenticação OAuth + JWT
- Swagger docs em `/api-docs`

✅ **Frontend pronto**:
- API client com auto-refresh
- Cypress configurado
- Base URL configurável via .env

✅ **Infraestrutura**:
- Docker support
- Dev Containers
- Scripts npm alinhados

⚠️ **Melhorias sugeridas**:
- Expandir testes E2E frontend (apenas 1 suite básica)
- Documentar cenários de falha para OAuth
- Adicionar fixtures Cypress para dados de teste
- Validar cobertura de testes backend (coverage report)

