# UC-032 — Emitir Certificados em Lote por Atividades

## Objetivo

Emitir certificados por atividades elegíveis de forma individual ou em lote.

## Atores

- Usuário autenticado
- Sistema

## Rastreabilidade

| Tipo | Referência     |
| ---- | -------------- |
| RN   | RN16, RN14     |
| US   | US-011, US-010 |

## Pré-condições

- Atividades elegíveis identificadas por presença confirmada.

## Fluxo Principal

1. Usuário acessa atividades elegíveis para certificado.
2. Seleciona emissão individual ou em lote.
3. Sistema gera certificados das atividades selecionadas.
4. Sistema disponibiliza downloads.

## Fluxos Alternativos

- FA1: Atividade sem elegibilidade é ignorada e reportada.

## Critérios de Aceite

| ID          | Critério                                                 |
| ----------- | -------------------------------------------------------- |
| CA-UC032-01 | Emissão por atividade funciona em modo individual e lote |
| CA-UC032-02 | Apenas atividades elegíveis geram certificado            |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
