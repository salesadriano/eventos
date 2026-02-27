# UC-031 — Validar Elegibilidade de Certificado por Atividade

## Objetivo

Validar elegibilidade para emissão de certificado por atividade.

## Atores

- Sistema
- Usuário/Administrador

## Rastreabilidade

| Tipo | Referência |
| ---- | ---------- |
| RN   | RN16       |
| US   | US-011     |

## Pré-condições

- Atividade vinculada ao evento.
- Solicitação de emissão por atividade.

## Fluxo Principal

1. Sistema identifica atividade solicitada.
2. Sistema consulta presença confirmada na atividade.
3. Sistema valida elegibilidade.
4. Sistema retorna status elegível/não elegível.

## Fluxos Alternativos

- FA1: Sem presença confirmada na atividade → não elegível.

## Critérios de Aceite

| ID          | Critério                                            |
| ----------- | --------------------------------------------------- |
| CA-UC031-01 | Elegibilidade é validada por atividade              |
| CA-UC031-02 | Regra independe de inscrição em todas ou individual |
