# UC-023 — Inscrição em Todas as Atividades

## Objetivo

Permitir inscrição automática do usuário em todas as atividades de um evento.

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

1. Usuário escolhe opção "todas as atividades".
2. Sistema registra inscrições em lote.
3. Sistema confirma sucesso da operação.

## Fluxos Alternativos

- FA1: Atividade indisponível/duplicada → sistema informa itens não processados.

## Critérios de Aceite

| ID          | Critério                                                 |
| ----------- | -------------------------------------------------------- |
| CA-UC023-01 | Inscrição em lote registra todas as atividades elegíveis |
| CA-UC023-02 | Usuário recebe feedback dos itens com falha              |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
