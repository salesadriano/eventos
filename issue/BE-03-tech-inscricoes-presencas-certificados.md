# [TECH]: Backend — Inscrições, Presenças e Certificação

## Template Utilizado

- .github/ISSUE_TEMPLATE/03-technical-task.yml

## Tipo de Tarefa

- Melhoria de arquitetura

## Prioridade

- P1 - Alta (importante)

## Módulo/Camada

- Múltiplos módulos

## Situação Atual

Os casos de uso exigem regras granulares por atividade para inscrição, presença e emissão de certificado (individual/lote). É necessário consolidar regras de elegibilidade e exposição de endpoints coerentes.

## Solução Proposta

Implementar/ajustar backend para:

- Inscrição por atividade (todas vs individual).
- Presença por atividade.
- Elegibilidade de certificados por evento e por atividade.
- Emissão individual e em lote para elegíveis.

Escopo de UCs:

- UC-006, UC-007, UC-008
- UC-009, UC-010, UC-011
- UC-023, UC-024, UC-025
- UC-027, UC-028, UC-029, UC-030, UC-031, UC-032

## Benefícios

- Regras de negócio centralizadas e testáveis.
- Menor inconsistência entre presença e emissão.
- Escalabilidade de processamento em lote.

## Riscos e Impactos

- Regras de elegibilidade podem introduzir regressão se não testadas.
- Emissão em lote pode impactar performance.

## Detalhes Técnicos

**Camadas afetadas:**

- Application (use cases de inscrição/presença/certificados)
- Infrastructure (repositórios e geração de certificado)
- Presentation (endpoints e DTOs)

## Critérios de Aceitação

- [ ] Inscrição por atividade aplica regra de configuração administrativa.
- [ ] Presença por atividade persiste e consulta corretamente.
- [ ] Certificado por evento/atividade só emite para elegíveis.
- [ ] Emissão em lote processa lista elegível sem inconsistência.
- [ ] Testes automatizados cobrindo cenários positivos e negativos.

## Estimativa de Esforço

- XXL (2+ semanas)

## Áreas Relacionadas

- [x] Application Layer (Use Cases, DTOs)
- [x] Infrastructure Layer (Repositories, External APIs)
- [x] API REST / Swagger
- [x] Testes automatizados

## Estratégia de Testes

- Unitários para regras de elegibilidade.
- Integração para inscrição/presença/certificados.
- Casos de borda: duplicidade, ausência de presença, lote com falhas parciais.

## Plano de Migração

1. Revisar e isolar regras de elegibilidade.
2. Ajustar contratos de endpoints.
3. Executar regressão dos UCs relacionados.

## Referências

- docs/case/UC-006-configurar-inscricao-atividade.md
- docs/case/UC-009-emissao-certificado-evento.md
- docs/case/UC-011-certificado-por-atividade.md
- docs/case/UC-030-emitir-certificados-lote-eventos.md
- docs/case/UC-032-emitir-certificados-lote-atividades.md

## Checklist

- [x] Esta tarefa está alinhada com a arquitetura do projeto
- [x] Considerei o impacto em código existente
- [x] Defini critérios claros de aceitação
