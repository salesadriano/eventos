# UC-037 — Enviar Arquivo ao Repositório Ativo

## Objetivo

Enviar apresentação para o provedor de armazenamento ativo.

## Atores

- Sistema
- Palestrante/Administrador

## Rastreabilidade

| Tipo | Referência     |
| ---- | -------------- |
| RN   | RN10, RN12     |
| US   | US-013, US-014 |

## Pré-condições

- Arquivo validado.
- Repositório ativo configurado.

## Fluxo Principal

1. Sistema identifica repositório ativo.
2. Sistema envia arquivo ao provedor configurado.
3. Sistema recebe confirmação de upload.

## Fluxos Alternativos

- FA1: Falha do provedor → sistema registra erro e retorna falha controlada.

## Critérios de Aceite

| ID          | Critério                                   |
| ----------- | ------------------------------------------ |
| CA-UC037-01 | Upload usa provedor ativo configurado      |
| CA-UC037-02 | Falhas de envio são tratadas e registradas |
