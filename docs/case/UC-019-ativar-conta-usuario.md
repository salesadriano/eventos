# UC-019 — Finalizar Onboarding via Callback OAuth

## Objetivo

Permitir ativação da conta após callback OAuth válido, sem definição de senha local obrigatória.

## Atores

- Usuário
- Sistema
- Provedor OAuth/OIDC

## Rastreabilidade

| Tipo | Referência     |
| ---- | -------------- |
| RN   | RN11, RN17     |
| US   | US-002, US-018 |

## Pré-condições

- Fluxo OAuth iniciado com `state` e PKCE válidos.

## Fluxo Principal

1. Provedor OAuth redireciona usuário para callback do sistema com `code` e `state`.
2. Sistema valida `state` e `code_verifier` (PKCE).
3. Sistema troca `code` por tokens no back-channel.
4. Sistema obtém identidade federada e vincula ao usuário.
5. Sistema ativa conta e estabelece sessão.

## Fluxos Alternativos

- FA1: `state` inválido ou ausente → sistema rejeita callback e solicita novo início.
- FA2: Falha na troca de `code` por tokens → sistema não ativa conta e registra erro.

## Critérios de Aceite

| ID          | Critério                                                   |
| ----------- | ---------------------------------------------------------- |
| CA-UC019-01 | Conta é ativada somente com callback OAuth válido          |
| CA-UC019-02 | Conta não exige definição de senha local no fluxo federado |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
