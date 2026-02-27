# UC-028 — Gerar e Disponibilizar Certificado por Evento

## Objetivo

Gerar o certificado do evento para participante elegível e disponibilizar download.

## Atores

- Sistema
- Usuário/Administrador

## Rastreabilidade

| Tipo | Referência |
| ---- | ---------- |
| RN   | RN13       |
| US   | US-009     |

## Pré-condições

- Elegibilidade validada como positiva.
- Dados do evento e participante disponíveis.

## Fluxo Principal

1. Sistema compõe certificado com dados oficiais.
2. Sistema aplica imagem de cabeçalho do certificado definida no cadastro do evento (quando existente).
3. Sistema gera arquivo do certificado.
4. Sistema disponibiliza arquivo para download.

## Fluxos Alternativos

- FA1: Erro de geração do arquivo → sistema retorna falha controlada.

## Critérios de Aceite

| ID          | Critério                                                           |
| ----------- | ------------------------------------------------------------------ |
| CA-UC028-01 | Certificado contém dados corretos de evento e participante         |
| CA-UC028-02 | Download é disponibilizado ao solicitante                          |
| CA-UC028-03 | Cabeçalho visual do certificado segue imagem configurada no evento |

## Gate UX

Este caso exige validação do UX Expert antes do aceite final.
