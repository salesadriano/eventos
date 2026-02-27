# UC-018 — Iniciar Onboarding OAuth de Usuário

## Objetivo

Iniciar onboarding OAuth para usuário recém-convidado ou auto cadastrado.

## Atores

- Sistema
- Provedor OAuth/OIDC
- Serviço de E-mail (quando o início ocorrer por convite)

## Rastreabilidade

| Tipo | Referência     |
| ---- | -------------- |
| RN   | RN11, RN17     |
| US   | US-002, US-017 |

## Pré-condições

- Provedor OAuth configurado e disponível.

## Fluxo Principal

1. Sistema recebe solicitação de cadastro/convite.
2. Sistema prepara contexto de onboarding com `state` e `code_challenge`.
3. Sistema gera URL de autorização do provedor OAuth.
4. Sistema redireciona usuário para o provedor ou envia link de convite com início do fluxo OAuth.

## Fluxos Alternativos

- FA1: Provedor indisponível → sistema retorna erro temporário e registra incidente.
- FA2: Falha de envio de convite por e-mail → sistema registra erro e disponibiliza reenvio.

## Critérios de Aceite

| ID          | Critério                                                       |
| ----------- | -------------------------------------------------------------- |
| CA-UC018-01 | Início de onboarding OAuth é gerado com sucesso                |
| CA-UC018-02 | `state` e `code_challenge` são emitidos para proteção do fluxo |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
