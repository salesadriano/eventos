# UC-024 — Inscrição Individual por Atividade

## Objetivo

Permitir ao usuário escolher atividades específicas para inscrição.

## Atores

- Usuário
- Sistema

## Rastreabilidade

| Tipo | Referência |
| ---- | ---------- |
| RN   | RN03, RN15 |
| US   | US-007     |

## Pré-condições

- Evento com inscrição por atividade habilitada.

## Fluxo Principal

1. Usuário seleciona atividades desejadas.
2. Sistema valida disponibilidade e duplicidade.
3. Sistema registra inscrições selecionadas.

## Fluxos Alternativos

- FA1: Atividade inválida/sem vaga → item é recusado.

## Critérios de Aceite

| ID          | Critério                                         |
| ----------- | ------------------------------------------------ |
| CA-UC024-01 | Inscrição registra somente atividades escolhidas |
| CA-UC024-02 | Sistema bloqueia duplicidade por atividade       |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
