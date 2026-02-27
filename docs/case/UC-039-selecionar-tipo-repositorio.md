# UC-039 — Selecionar Tipo de Repositório

## Objetivo

Selecionar o tipo de repositório de arquivos (Local, Google Drive ou AWS S3).

## Atores

- Administrador
- Sistema

## Rastreabilidade

| Tipo | Referência |
| ---- | ---------- |
| RN   | RN12       |
| US   | US-014     |

## Pré-condições

- Administrador autenticado.

## Fluxo Principal

1. Administrador acessa configurações de armazenamento.
2. Seleciona tipo de repositório.
3. Sistema valida opção selecionada.

## Fluxos Alternativos

- FA1: Tipo inválido → sistema rejeita seleção.

## Critérios de Aceite

| ID          | Critério                               |
| ----------- | -------------------------------------- |
| CA-UC039-01 | Seleção de tipo disponível e funcional |
| CA-UC039-02 | Sistema aceita apenas tipos suportados |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
