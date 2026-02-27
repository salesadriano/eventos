# UC-020 — Criar Evento

## Objetivo

Cadastrar um novo evento com dados obrigatórios válidos.

## Atores

- Administrador
- Sistema

## Rastreabilidade

| Tipo | Referência |
| ---- | ---------- |
| RN   | RN01       |
| US   | US-004     |

## Pré-condições

- Administrador autenticado.

## Fluxo Principal

1. Administrador informa dados do evento.
2. Administrador informa, opcionalmente, imagem para header da aplicação e imagem para cabeçalho do certificado.
3. Sistema valida campos, regras de data e formato das imagens.
4. Sistema persiste evento.

## Fluxos Alternativos

- FA1: Dados inválidos → sistema retorna erro de validação.
- FA2: Imagem fora do padrão permitido → sistema bloqueia cadastro e orienta correção.

## Critérios de Aceite

| ID          | Critério                                                                                      |
| ----------- | --------------------------------------------------------------------------------------------- |
| CA-UC020-01 | Evento é criado com sucesso                                                                   |
| CA-UC020-02 | Regras de validação impedem cadastro inconsistente                                            |
| CA-UC020-03 | Campos de imagem de header da aplicação e cabeçalho do certificado são aceitos quando válidos |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
