# UC-017 — Renovar Sessão OAuth (Refresh Token)

## Objetivo

Renovar a sessão do usuário automaticamente com refresh token rotativo quando o access token expirar.

## Atores

- Usuário autenticado
- Sistema de Autenticação
- Provedor OAuth/OIDC

## Rastreabilidade

| Tipo | Referência     |
| ---- | -------------- |
| RN   | RN02, RN18     |
| US   | US-001, US-019 |

## Pré-condições

- Usuário autenticado com refresh token válido e não revogado.

## Fluxo Principal

1. Cliente recebe resposta `401` por expiração de access token.
2. Cliente solicita renovação em endpoint de sessão.
3. Sistema valida refresh token atual e sua integridade.
4. Sistema executa rotação do refresh token.
5. Sistema emite novo access token e novo refresh token.
6. Cliente repete requisição original com sucesso.

## Fluxos Alternativos

- FA1: Refresh token inválido/expirado/revogado → sessão encerrada e usuário redirecionado para login OAuth.
- FA2: Detecção de reutilização de refresh token → sistema revoga cadeia de sessão e exige novo login.

## Critérios de Aceite

| ID          | Critério                                                      |
| ----------- | ------------------------------------------------------------- |
| CA-UC017-01 | Renovação de sessão ocorre sem exigir novo login imediato     |
| CA-UC017-02 | Rotação de refresh token ocorre a cada renovação bem-sucedida |
| CA-UC017-03 | Falha de renovação encerra sessão com feedback claro          |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
