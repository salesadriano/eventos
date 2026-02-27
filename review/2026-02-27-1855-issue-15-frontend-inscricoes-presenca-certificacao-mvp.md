# Review — Issue #15 (Frontend Inscrições, Presença e Certificação)

## Contexto e objetivo
Adicionar fluxo frontend MVP para operações de inscrição e presença com cálculo de elegibilidade de certificado no cliente, consumindo APIs existentes de inscrições e presenças.

## Escopo técnico e arquivos modificados
- `src/presentation/hooks/useOperationalFlows.ts` (novo)
- `src/presentation/components/OperationalFlowsPanel.tsx` (novo)
- `src/App.tsx`

## Decisão arquitetural (ADR resumido)
- **Decisão:** encapsular regras operacionais da UI em hook dedicado (`useOperationalFlows`) com cálculo local de elegibilidade.
- **Alternativas consideradas:**
  - acoplar chamadas API diretamente no `App` (rejeitada por baixa reutilização).
- **Trade-offs:** entrega rápida em MVP com elegibilidade calculada no cliente enquanto endpoints dedicados de certificado evoluem no backend.

## Evidências de validação
- Execução de testes frontend:
  - Comando: `npm test`
  - Resultado: `2 passing, 0 failing`
- Capacidades adicionadas:
  - registrar inscrição.
  - registrar presença.
  - visualizar total elegível para certificado.

## Riscos, impacto e rollback
- **Riscos:** cálculo de elegibilidade no frontend pode divergir de regras backend futuras.
- **Impacto:** melhora visibilidade operacional para ciclo inscrição/presença/certificado.
- **Rollback:** reverter commit e remover painel/hook operacional.

## Próximos passos recomendados
1. Consumir endpoint backend dedicado de elegibilidade quando disponível.
2. Expandir UI para emissão individual/lote de certificados.
3. Adicionar cenários e2e cobrindo fluxo completo.

## Diagrama (Mermaid)
```mermaid
flowchart LR
  A[OperationalFlowsPanel] --> B[useOperationalFlows]
  B --> C[/inscriptions/all]
  B --> D[/presences/all]
  B --> E[Cálculo local de elegibilidade]
  E --> F[Resumo elegíveis na UI]
```
