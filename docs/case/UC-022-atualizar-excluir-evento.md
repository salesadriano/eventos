# UC-022 — Atualizar e Excluir Evento

## Objetivo

Permitir manutenção de eventos já cadastrados.

## Atores

- Administrador
- Sistema

## Rastreabilidade

| Tipo | Referência |
| ---- | ---------- |
| RN   | RN01       |
| US   | US-004     |

## Pré-condições

- Evento existente.
- Administrador autenticado.

## Fluxo Principal

1. Administrador seleciona evento existente.
2. Atualiza dados, incluindo opcionalmente imagem de header da aplicação e imagem de cabeçalho do certificado.
3. Quando necessário, solicita exclusão do evento.
4. Sistema aplica ação solicitada.

## Fluxos Alternativos

- FA1: Evento inexistente → operação cancelada com erro de negócio.
- FA2: Imagem inválida na atualização → sistema rejeita alteração e mantém versão anterior.

## Critérios de Aceite

| ID          | Critério                                                  |
| ----------- | --------------------------------------------------------- |
| CA-UC022-01 | Atualização persiste dados corretamente                   |
| CA-UC022-02 | Exclusão remove evento conforme regra de negócio          |
| CA-UC022-03 | Atualização de imagens do evento é aplicada quando válida |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
