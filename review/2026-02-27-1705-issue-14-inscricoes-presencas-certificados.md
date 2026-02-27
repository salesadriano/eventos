# Review — Issue #14 (Backend Inscrições, Presenças e Certificação)

## Contexto e objetivo
Implementar regras de granularidade por atividade para inscrições/presenças e introduzir casos de uso de elegibilidade de certificados (individual e lote).

## Escopo técnico e arquivos modificados
- `server/src/domain/entities/InscriptionEntity.ts`
- `server/src/domain/entities/PresenceEntity.ts`
- `server/src/domain/repositories/InscriptionRepository.ts`
- `server/src/application/dtos/InscriptionDtos.ts`
- `server/src/application/dtos/PresenceDtos.ts`
- `server/src/application/usecases/inscriptions/CreateInscriptionUseCase.ts`
- `server/src/application/usecases/presences/CreatePresenceUseCase.ts`
- `server/src/application/usecases/certificates/EvaluateCertificateEligibilityUseCase.ts` (novo)
- `server/src/application/usecases/certificates/EvaluateCertificateBatchUseCase.ts` (novo)
- `server/src/infrastructure/mappers/InscriptionMapper.ts`
- `server/src/infrastructure/mappers/PresenceMapper.ts`
- `server/src/infrastructure/repositories/GoogleSheetsInscriptionRepository.ts`
- `server/src/infrastructure/repositories/GoogleSheetsPresenceRepository.ts`
- `server/tests-cypress/specs/certificates/EvaluateCertificateEligibilityUseCase.spec.ts` (novo)
- `server/tests-cypress/specs/certificates/EvaluateCertificateBatchUseCase.spec.ts` (novo)
- `server/tests-cypress/specs/inscriptions/CreateInscriptionUseCase.spec.ts`
- `server/tests-cypress/specs/presences/CreatePresenceUseCase.spec.ts`
- `server/tests-cypress/stubs/InscriptionRepositoryStub.ts`
- `server/tests-cypress/stubs/PresenceRepositoryStub.ts`
- `server/tests-cypress/runCoverage.ts`

## Decisão arquitetural (ADR resumido)
- **Decisão:** adicionar `activityId` opcional em `InscriptionEntity` e `PresenceEntity` para suportar cenários de inscrição/presença por atividade.
- **Decisão:** implementar elegibilidade de certificado em use cases dedicados (`EvaluateCertificateEligibilityUseCase` e `EvaluateCertificateBatchUseCase`), mantendo regra de negócio na camada Application.
- **Alternativas consideradas:**
  - implementar validações no controller (rejeitada por violar separação de responsabilidades).
  - acoplar emissão de certificado diretamente nos fluxos de presença (rejeitada por reduzir reuso e testabilidade).
- **Trade-offs:** mais regras e campos em entidades/repos em troca de melhor aderência aos UCs e cobertura de cenários event/activity.

## Evidências de validação
- Execução de testes backend:
  - Comando: `cd server && npm test`
  - Resultado: `Total: 35, Falhas: 0`
- Cenários validados:
  - elegibilidade individual por evento e por atividade.
  - elegibilidade em lote com separação de elegíveis/ineligíveis.
  - prevenção de duplicidade de presença por mesma atividade.

## Riscos, impacto e rollback
- **Riscos:** necessidade de alinhamento de cabeçalho/colunas nas sheets de `inscriptions` e `presences` para refletir `activityId`.
- **Impacto:** payloads de inscrição/presença passam a expor `activityId`; lógica de duplicidade muda para chave composta (`eventId`, `userId`, `activityId`).
- **Rollback:** reverter commit da issue e remover os novos use cases/campos `activityId`.

## Próximos passos recomendados
1. Expor endpoints HTTP para consulta de elegibilidade individual/lote.
2. Integrar emissão real de certificado para os elegíveis retornados.
3. Adicionar cenários de erro com ausência de presença confirmada por atividade.

## Diagrama (Mermaid)
```mermaid
flowchart LR
  A[CreateInscription / CreatePresence] --> B[Entities com activityId opcional]
  B --> C[Repositories + Mappers Google Sheets]
  C --> D[EvaluateCertificateEligibilityUseCase]
  D --> E[EvaluateCertificateBatchUseCase]
  E --> F[Lista elegíveis e ineligíveis]
```
