# UC-029 — Listar Certificados Elegíveis do Usuário

## Objetivo

Exibir ao usuário os eventos elegíveis para emissão de certificados.

## Atores

- Usuário autenticado
- Sistema

## Rastreabilidade

| Tipo | Referência |
| ---- | ---------- |
| RN   | RN14       |
| US   | US-010     |

## Pré-condições

- Usuário autenticado.

## Fluxo Principal

1. Usuário acessa área de certificados.
2. Sistema identifica eventos com presença confirmada.
3. Sistema exibe lista de elegíveis.

## Fluxos Alternativos

- FA1: Nenhum elegível → sistema exibe estado vazio.

## Critérios de Aceite

| ID          | Critério                                |
| ----------- | --------------------------------------- |
| CA-UC029-01 | Lista inclui somente itens elegíveis    |
| CA-UC029-02 | Estado vazio é exibido quando aplicável |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
