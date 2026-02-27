# UC-035 — Editar Perfil de Palestrante

## Objetivo

Permitir atualização de dados já cadastrados do palestrante.

## Atores

- Administrador
- Sistema

## Rastreabilidade

| Tipo | Referência |
| ---- | ---------- |
| RN   | RN08       |
| US   | US-012     |

## Pré-condições

- Perfil de palestrante existente.

## Fluxo Principal

1. Administrador abre perfil existente.
2. Atualiza dados desejados.
3. Sistema valida alterações e persiste atualização.

## Fluxos Alternativos

- FA1: Perfil inexistente → sistema retorna erro de negócio.

## Critérios de Aceite

| ID          | Critério                                |
| ----------- | --------------------------------------- |
| CA-UC035-01 | Alterações são persistidas corretamente |
| CA-UC035-02 | Sistema mantém integridade do perfil    |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
