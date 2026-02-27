# UC-033 — Cadastrar Dados Básicos do Palestrante

## Objetivo

Registrar dados básicos do palestrante para criação do perfil.

## Atores

- Administrador
- Sistema

## Rastreabilidade

| Tipo | Referência |
| ---- | ---------- |
| RN   | RN08       |
| US   | US-012     |

## Pré-condições

- Administrador autenticado.

## Fluxo Principal

1. Administrador informa nome e dados essenciais.
2. Sistema valida obrigatoriedade e formato.
3. Sistema cria registro base do palestrante.

## Fluxos Alternativos

- FA1: Campos obrigatórios ausentes → sistema bloqueia cadastro.

## Critérios de Aceite

| ID          | Critério                                    |
| ----------- | ------------------------------------------- |
| CA-UC033-01 | Cadastro base é salvo com sucesso           |
| CA-UC033-02 | Validações de campos obrigatórios funcionam |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
