# UC-042 — Atualizar Credenciais do Repositório

## Objetivo

Atualizar credenciais existentes de forma segura e sem exposição de segredos.

## Atores

- Administrador
- Sistema

## Rastreabilidade

| Tipo | Referência |
| ---- | ---------- |
| RN   | RN12       |
| US   | US-015     |

## Pré-condições

- Credenciais previamente cadastradas.

## Fluxo Principal

1. Administrador solicita atualização de credenciais.
2. Sistema permite edição com mascaramento de segredos.
3. Sistema revalida e testa conexão.
4. Sistema aplica nova credencial em caso de sucesso.

## Fluxos Alternativos

- FA1: Falha no teste de conexão → sistema não substitui credenciais válidas atuais.

## Critérios de Aceite

| ID          | Critério                                             |
| ----------- | ---------------------------------------------------- |
| CA-UC042-01 | Atualização preserva segurança de segredos           |
| CA-UC042-02 | Credenciais antigas permanecem se atualização falhar |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
