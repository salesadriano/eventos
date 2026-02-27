# UC-040 — Salvar Repositório Ativo

## Objetivo

Persistir o repositório selecionado como provedor ativo para uploads.

## Atores

- Administrador
- Sistema

## Rastreabilidade

| Tipo | Referência |
| ---- | ---------- |
| RN   | RN12       |
| US   | US-014     |

## Pré-condições

- Tipo de repositório selecionado.

## Fluxo Principal

1. Administrador confirma configuração.
2. Sistema salva repositório ativo.
3. Sistema registra alteração para auditoria.

## Fluxos Alternativos

- FA1: Falha de persistência → sistema mantém configuração anterior.

## Critérios de Aceite

| ID          | Critério                       |
| ----------- | ------------------------------ |
| CA-UC040-01 | Repositório ativo é persistido |
| CA-UC040-02 | Mudança fica auditável         |
