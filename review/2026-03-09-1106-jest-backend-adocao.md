# Adoção prática de Jest no backend (/server)

## Contexto e objetivo
Migrar a estratégia de testes backend de execução via Cypress component-style para adoção prática de Jest com TypeScript, preservando a arquitetura atual e mantendo os cenários legados sem remoção sem equivalente migrado.

Objetivos atendidos:
- Configuração de Jest com TypeScript no backend.
- Migração de cenários unitários reaproveitando stubs e regras dos testes em `server/tests-cypress/**`.
- Inclusão de suíte de integração HTTP com `supertest` validando:
  - `GET /api/health`.
  - retorno `401` em rota protegida sem token (`GET /api/events`).
- Atualização de scripts de teste no `server/package.json`.
- Validação de `cd server && npm run build && npm test` com sucesso.

## Escopo técnico e arquivos modificados
### Backend (server)
- `server/package.json`
- `server/package-lock.json`
- `server/jest.config.ts`
- `server/tsconfig.jest.json`
- `server/tests/setup-env.ts`
- `server/tests/utils/createAppForTests.ts`
- `server/tests/integration/health.integration.test.ts`
- `server/tests/integration/protected-routes.integration.test.ts`
- `server/tests/unit/utils/expectError.ts`
- `server/tests/unit/usecases/start-oauth-authorization.usecase.test.ts`
- `server/tests/unit/usecases/get-events.usecase.test.ts`
- `server/tests/unit/usecases/create-user.usecase.test.ts`
- `server/tests/unit/usecases/refresh-token.usecase.test.ts`

## ADR resumido
### Decisão
Adotar Jest com `ts-jest` em configuração por projetos (`unit` e `integration`) e migrar cenários legados por equivalência funcional, reaproveitando stubs existentes em `tests-cypress/stubs` para evitar refatoração ampla.

### Alternativas consideradas
1. **Manter apenas Cypress para backend unitário**
   - Prós: sem esforço inicial de migração.
   - Contras: menor aderência ao padrão backend Node/Jest, execução mais lenta e menor foco em testes de unidade puros.
2. **Migrar 100% dos arquivos legados diretamente importando specs Cypress**
   - Prós: máxima reutilização textual.
   - Contras: incompatibilidade com `chai` ESM em runtime do Jest sem configuração adicional complexa.
3. **Reescrever todos os testes do zero**
   - Prós: padronização total imediata.
   - Contras: maior risco e esforço, menor rastreabilidade de equivalência com legado.

### Trade-offs
- Foi escolhida migração incremental com equivalência de cenários (mesmas regras e fluxos) em Jest, equilibrando velocidade, confiabilidade e manutenção da arquitetura.
- Reutilização de stubs legados acelerou migração, porém manteve temporariamente dependência de diretórios legados em testes unitários.

## Evidências de validação
### Build + Testes obrigatórios
```bash
cd server && npm run build && npm test
```
Resultado:
- `build`: sucesso
- `jest`: `Test Suites: 6 passed, 6 total`
- `Tests: 9 passed, 9 total`

### Scripts segmentados
```bash
cd server && npm run test:unit && npm run test:integration
```
Resultado:
- Unit: sucesso
- Integration: sucesso

### Cobertura (script novo)
```bash
cd server && npm run test:coverage -- --runInBand
```
Resultado:
- `Test Suites: 6 passed, 6 total`
- `Tests: 9 passed, 9 total`
- Cobertura gerada com relatório textual.

### Verificação manual
- Conferida rota pública `GET /api/health` respondendo `200` com `{ status: "ok" }`.
- Conferida rota protegida `GET /api/events` sem `Authorization` retornando `401` e mensagem de ausência de token.

## Riscos, impacto e rollback
### Riscos
- Testes unitários migrados ainda dependem de stubs em `tests-cypress/stubs` (acoplamento temporário ao legado).
- Possível diferença de comportamento entre assertivas Jest vs Chai em casos futuros mais complexos.

### Impacto
- Pipeline backend com runner padrão de mercado (`jest`).
- Separação clara entre testes unitários e integração HTTP.
- Base preparada para migração progressiva dos cenários remanescentes.

### Rollback
1. Restaurar scripts legados como padrão (`test`, `test:coverage`) no `server/package.json`.
2. Remover `jest.config.ts`, `tsconfig.jest.json` e diretório `server/tests/`.
3. Executar novamente `npm ci` para sincronizar lockfile após rollback.

## Próximos passos recomendados
1. Migrar os demais cenários de `tests-cypress/specs/**` para `server/tests/unit/**` por domínio (auth, events, users, inscrições, presenças).
2. Introduzir factories próprias em `server/tests/factories/**` para reduzir dependência dos stubs legados.
3. Adicionar suíte de integração autenticada (com token válido) para rotas críticas de CRUD.
4. Configurar threshold mínimo de cobertura por projeto (`unit` e `integration`) no Jest.

## Diagrama (arquitetura de testes)
```mermaid
flowchart TD
  A[package.json scripts] --> B[jest.config.ts projects]
  B --> C[Unit tests\nserver/tests/unit/**]
  B --> D[Integration tests\nserver/tests/integration/**]
  C --> E[UseCases + stubs legados\nserver/tests-cypress/stubs/**]
  D --> F[createAppForTests]
  F --> G[Express app + routes]
  G --> H[/api/health => 200]
  G --> I[/api/events sem token => 401]
```
