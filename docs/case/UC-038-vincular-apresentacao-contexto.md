# UC-038 — Vincular Apresentação ao Contexto

## Objetivo

Associar arquivo enviado ao evento/atividade/palestrante correspondente.

## Atores

- Sistema
- Palestrante/Administrador

## Rastreabilidade

| Tipo | Referência |
| ---- | ---------- |
| RN   | RN10       |
| US   | US-013     |

## Pré-condições

- Upload concluído com sucesso.

## Fluxo Principal

1. Sistema recebe metadados do upload.
2. Sistema vincula arquivo ao evento/atividade/palestrante.
3. Sistema disponibiliza item na listagem de apresentações.

## Fluxos Alternativos

- FA1: Contexto inválido/inexistente → vínculo é rejeitado.

## Critérios de Aceite

| ID          | Critério                                   |
| ----------- | ------------------------------------------ |
| CA-UC038-01 | Arquivo fica associado ao contexto correto |
| CA-UC038-02 | Item aparece na consulta de apresentações  |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
