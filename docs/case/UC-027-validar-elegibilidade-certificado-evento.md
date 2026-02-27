# UC-027 — Validar Elegibilidade de Certificado por Evento

## Objetivo

Validar se o participante está elegível para emissão de certificado do evento.

## Atores

- Sistema
- Usuário/Administrador (solicitante)

## Rastreabilidade

| Tipo | Referência |
| ---- | ---------- |
| RN   | RN13       |
| US   | US-009     |

## Pré-condições

- Solicitação de emissão recebida.
- Participante vinculado ao evento.

## Fluxo Principal

1. Sistema recebe solicitação de emissão.
2. Sistema consulta presença do participante no evento.
3. Sistema valida regra de elegibilidade.
4. Sistema retorna status elegível/não elegível.

## Fluxos Alternativos

- FA1: Participante sem presença confirmada → status não elegível.

## Critérios de Aceite

| ID          | Critério                                             |
| ----------- | ---------------------------------------------------- |
| CA-UC027-01 | Elegibilidade é baseada em presença confirmada       |
| CA-UC027-02 | Resultado da validação é retornado de forma objetiva |
