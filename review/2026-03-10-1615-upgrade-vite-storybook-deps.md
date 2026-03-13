# Upgrade Vite 7.3.1 + Dependencias Storybook

## Contexto e objetivo

Atualizar o Vite para a versao mais recente ja validada no ambiente (7.3.1) e instalar dependencias do Storybook recentes e compativeis com Vite 7 para viabilizar o CA12 da FE-05.

## Escopo tecnico e arquivos modificados

- Atualizado `vite` em `package.json` para `^7.3.1`.
- Adicionadas dependencias de Storybook:
  - `storybook@^10.2.17`
  - `@storybook/react-vite@^10.2.17`
  - `@storybook/addon-a11y@^10.2.17`
- Atualizado lockfile com resolucao de dependencias.

Arquivos alterados:

- `package.json`
- `package-lock.json`

## Decisao arquitetural (ADR resumido)

- Decisao: adotar Storybook 10 com framework `@storybook/react-vite` por compatibilidade declarada com Vite `^5 || ^6 || ^7`.
- Alternativas consideradas:
  - Storybook 8.6.x com `@storybook/react-vite`.
  - Manter apenas documentacao manual sem Storybook.
- Trade-offs:
  - Storybook 10 reduz risco de incompatibilidade com Vite 7.
  - Introduz aumento do grafo de dependencias de desenvolvimento.

```mermaid
flowchart LR
    A[Vite 7.3.1] --> B[@storybook/react-vite 10.2.17]
    B --> C[storybook 10.2.17]
    C --> D[addon-a11y 10.2.17]
```

## Evidencias de validacao

- `npm install` executado com sucesso apos upgrade de Vite.
- `npm ls vite --depth=0`:
  - `vite@7.3.1`
- `npm install -D storybook@latest @storybook/react-vite@latest @storybook/addon-a11y@latest` executado com sucesso.
- `npm ls storybook @storybook/react-vite @storybook/addon-a11y vite --depth=0`:
  - `storybook@10.2.17`
  - `@storybook/react-vite@10.2.17`
  - `@storybook/addon-a11y@10.2.17`
  - `vite@7.3.1`

## Riscos, impacto e plano de rollback

- Riscos:
  - Mudancas de APIs/comandos entre major versions do Storybook ao configurar runtime posteriormente.
- Impacto:
  - Nenhum impacto em runtime de producao; alteracoes somente em dependencias de desenvolvimento.
- Rollback:
  - Reverter `package.json` e `package-lock.json` para o commit anterior e executar `npm install`.

## Proximos passos recomendados

1. Gerar configuracao do Storybook (`.storybook/main.ts` e `preview.ts`) com builder Vite.
2. Adicionar scripts `storybook` e `build-storybook` no `package.json`.
3. Criar primeira story para componente base (ex.: Button) e validar a11y addon em execucao local.
