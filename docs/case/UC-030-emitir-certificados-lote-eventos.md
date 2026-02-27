# UC-030 — Emitir Certificados em Lote por Eventos

## Objetivo

Emitir em lote os certificados elegíveis de eventos para o usuário.

## Atores

- Usuário autenticado
- Sistema

## Rastreabilidade

| Tipo | Referência |
| ---- | ---------- |
| RN   | RN14       |
| US   | US-010     |

## Pré-condições

- Lista de elegíveis disponível.

## Fluxo Principal

1. Usuário solicita emissão em lote.
2. Sistema processa cada evento elegível.
3. Sistema gera certificados correspondentes.
4. Sistema disponibiliza resultados da emissão.

## Fluxos Alternativos

- FA1: Falha pontual em item → sistema conclui demais e reporta falhas.

## Critérios de Aceite

| ID          | Critério                                                   |
| ----------- | ---------------------------------------------------------- |
| CA-UC030-01 | Emissão em lote processa todos os elegíveis                |
| CA-UC030-02 | Falhas parciais são reportadas sem interromper todo o lote |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
