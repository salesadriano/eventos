# UC-026 — Validar Conexão do Repositório de Arquivos

## Objetivo

Validar conectividade do provedor de armazenamento antes de salvar credenciais.

## Atores

- Administrador
- Sistema

## Rastreabilidade

| Tipo | Referência |
| ---- | ---------- |
| RN   | RN12       |
| US   | US-015     |

## Pré-condições

- Provedor de armazenamento selecionado.
- Credenciais informadas.

## Fluxo Principal

1. Administrador aciona teste de conexão.
2. Sistema tenta conexão com o provedor ativo.
3. Sistema retorna sucesso ou falha.
4. Em sucesso, credenciais podem ser persistidas.

## Fluxos Alternativos

- FA1: Timeout/erro de autenticação → conexão inválida e salvamento bloqueado.

## Critérios de Aceite

| ID          | Critério                                  |
| ----------- | ----------------------------------------- |
| CA-UC026-01 | Teste de conexão retorna status confiável |
| CA-UC026-02 | Credenciais inválidas não são confirmadas |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
