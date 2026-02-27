# UC-041 — Cadastrar Credenciais do Repositório

## Objetivo

Cadastrar credenciais de acesso para o provedor de armazenamento selecionado.

## Atores

- Administrador
- Sistema

## Rastreabilidade

| Tipo | Referência |
| ---- | ---------- |
| RN   | RN12       |
| US   | US-015     |

## Pré-condições

- Provedor de armazenamento definido.

## Fluxo Principal

1. Administrador informa credenciais.
2. Sistema valida campos obrigatórios e formato.
3. Sistema prepara credenciais para teste de conexão.

## Fluxos Alternativos

- FA1: Campo obrigatório ausente → sistema bloqueia avanço.

## Critérios de Aceite

| ID          | Critério                                  |
| ----------- | ----------------------------------------- |
| CA-UC041-01 | Credenciais são recebidas e validadas     |
| CA-UC041-02 | Formato inválido é rejeitado com feedback |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
