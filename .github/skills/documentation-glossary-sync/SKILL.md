---
name: documentation-glossary-sync
description: Gera e atualiza automaticamente um glossario documental a partir de arquivos de documentacao (md, txt, html, pdf pesquisavel), com significados, contexto de uso e referencias. Reutilizavel em qualquer projeto.
user-invocable: true
---

# Skill: Documentation Glossary Sync

## Objetivo

Manter um glossario documental sempre atualizado com termos e siglas usados em artefatos de documentacao do projeto.

## Quando usar

- Sempre que um novo documento for criado.
- Sempre que documentos existentes forem alterados.
- Antes de abrir PRs que alterem documentacao.

## Entradas esperadas

- Diretorio raiz do repositório.
- Arquivos de documentacao suportados:
  - Markdown (`.md`, `.markdown`)
  - Texto puro (`.txt`)
  - HTML (`.html`, `.htm`)
  - PDF pesquisavel (`.pdf`)

## Saida esperada

- Um glossario em `docs/GLOSSARIO_DOCUMENTACAO.md` com:
  - Termo/sigla
  - Significado em portugues claro
  - Utilizacao (contexto)
  - Referencias de onde aparece
  - Links de documentacao para conceitos complexos

## Fluxo padrao de execucao

1. Varra os documentos suportados nas pastas de documentacao (ex.: `docs/`, `review/`, `issue/`).
2. Extraia termos/siglas recorrentes.
3. Consolide duplicidades e normalize grafia.
4. Resolva significados com dicionario base + contexto local.
5. Gere/atualize `docs/GLOSSARIO_DOCUMENTACAO.md`.
6. Registre evidencias em `review/` quando houver mudanca relevante.

## Regras de qualidade

- Linguagem clara em portugues.
- Evitar definicoes vagas.
- Para conceitos complexos, incluir links oficiais (W3C, IETF, OpenID, etc.).
- Nao remover termos existentes sem justificativa.
- Se um termo for ambíguo, marcar como "Revisao humana necessaria".

## Automacao recomendada (reutilizavel)

- Expor comando no `package.json` (ex.: `npm run glossary:sync`).
- Adicionar workflow CI que execute em mudancas de docs.
- Opcional: bloquear PR quando o glossario estiver desatualizado.

## Comando de referencia

```bash
npm run glossary:sync
```
