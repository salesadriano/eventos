# UC-034 — Cadastrar Currículo, Redes e Contato

## Objetivo

Complementar perfil do palestrante com currículo, redes sociais e contatos.

## Atores

- Administrador
- Sistema

## Rastreabilidade

| Tipo | Referência |
| ---- | ---------- |
| RN   | RN08       |
| US   | US-012     |

## Pré-condições

- Palestrante já cadastrado com dados básicos.

## Fluxo Principal

1. Administrador acessa perfil do palestrante.
2. Informa currículo, links de redes e contato.
3. Sistema valida e persiste os dados complementares.

## Fluxos Alternativos

- FA1: URL inválida de rede social → sistema solicita correção.

## Critérios de Aceite

| ID          | Critério                                       |
| ----------- | ---------------------------------------------- |
| CA-UC034-01 | Dados complementares são salvos corretamente   |
| CA-UC034-02 | Formatos inválidos são rejeitados com feedback |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
