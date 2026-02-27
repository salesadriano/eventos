# UC-036 — Validar Arquivo de Apresentação

## Objetivo

Validar tipo e tamanho do arquivo antes do upload.

## Atores

- Palestrante/Administrador
- Sistema

## Rastreabilidade

| Tipo | Referência |
| ---- | ---------- |
| RN   | RN10       |
| US   | US-013     |

## Pré-condições

- Usuário autorizado no módulo de upload.

## Fluxo Principal

1. Usuário seleciona arquivo.
2. Sistema valida tipo permitido.
3. Sistema valida limite de tamanho.
4. Sistema autoriza envio.

## Fluxos Alternativos

- FA1: Tipo inválido → upload bloqueado.
- FA2: Tamanho excedido → upload bloqueado.

## Critérios de Aceite

| ID          | Critério                                     |
| ----------- | -------------------------------------------- |
| CA-UC036-01 | Tipo e tamanho são validados antes do envio  |
| CA-UC036-02 | Erro é apresentado de forma clara ao usuário |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
