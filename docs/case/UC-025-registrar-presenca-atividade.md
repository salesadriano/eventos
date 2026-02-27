# UC-025 — Registrar Presença por Atividade

## Objetivo

Registrar presença específica em atividade da programação.

## Atores

- Operador
- Sistema

## Rastreabilidade

| Tipo | Referência     |
| ---- | -------------- |
| RN   | RN04, RN16     |
| US   | US-008, US-011 |

## Pré-condições

- Inscrição válida na atividade.

## Fluxo Principal

1. Operador identifica inscrição na atividade.
2. Registra presença da atividade.
3. Sistema atualiza elegibilidade para certificado por atividade.

## Fluxos Alternativos

- FA1: Presença já registrada → sistema bloqueia duplicidade.

## Critérios de Aceite

| ID          | Critério                                              |
| ----------- | ----------------------------------------------------- |
| CA-UC025-01 | Presença por atividade é registrada corretamente      |
| CA-UC025-02 | Registro impacta emissão de certificado por atividade |
