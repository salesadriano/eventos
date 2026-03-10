# Registro de alteração - Plano de Teste E2E com persistência real

## Contexto e objetivo
Documentar a estratégia oficial de testes E2E do projeto com persistência real em Google Sheets, sem abordagem smoke.

## Escopo técnico e arquivos modificados
- `docs/plano-teste-e2e-persistencia-real.md` (novo)

## ADR resumido
- **Decisão:** adotar suíte E2E completa por domínio, sem smoke, com validação de persistência real.
- **Alternativas consideradas:** smoke suite + testes parciais; rejeitada por baixa cobertura de risco.
- **Trade-offs:** maior custo de execução em troca de maior confiabilidade e rastreabilidade.

## Evidências de validação
- Criação do artefato em `docs/`
- Revisão de aderência aos domínios e rotas documentadas

## Riscos, impacto e rollback
- **Risco:** divergência futura entre documentação e rotas implementadas.
- **Impacto:** falsos positivos/negativos na execução de QA.
- **Rollback:** remover arquivo criado e restaurar estratégia anterior de documentação.

## Próximos passos recomendados
1. Implementar specs Cypress por domínio conforme matriz.
2. Automatizar cleanup por `RUN_ID`.
3. Sincronizar docs de OAuth/API com rotas atuais.

```mermaid
flowchart LR
    A[Plano em docs] --> B[Implementação das specs E2E]
    B --> C[Execução em ambiente real]
    C --> D[Evidências e governança]
```
