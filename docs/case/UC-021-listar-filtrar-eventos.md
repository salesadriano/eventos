# UC-021 — Listar e Filtrar Eventos

## Objetivo

Consultar eventos com paginação e filtros.

## Atores

- Administrador
- Usuário
- Sistema

## Rastreabilidade

| Tipo | Referência |
| ---- | ---------- |
| RN   | RN01       |
| US   | US-004     |

## Pré-condições

- Usuário autenticado.

## Fluxo Principal

1. Ator acessa listagem de eventos.
2. Sistema retorna eventos paginados.
3. Ator aplica filtros.
4. Sistema atualiza resultado.

## Fluxos Alternativos

- FA1: Nenhum evento encontrado para os filtros informados → sistema exibe estado vazio.
- FA2: Parâmetros de paginação inválidos → sistema aplica paginação padrão e retorna aviso.

## Critérios de Aceite

| ID          | Critério                              |
| ----------- | ------------------------------------- |
| CA-UC021-01 | Paginação funciona corretamente       |
| CA-UC021-02 | Filtros retornam resultados coerentes |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
