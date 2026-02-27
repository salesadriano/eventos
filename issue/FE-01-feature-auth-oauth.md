# [FEATURE]: Frontend — Autenticação OAuth e Sessão Segura

## Template Utilizado

- .github/ISSUE_TEMPLATE/01-feature-request.yml

## Prioridade

- P0 - Crítica (bloqueante)

## Módulo

- OAuth

## Epic / Fase do Roadmap

- OAuth: Autenticação Social

## História de Usuário

Como usuário da plataforma
Eu quero autenticar com OAuth, completar onboarding e manter sessão segura no frontend
Para que eu acesse o sistema sem fricção e com segurança.

## Descrição Detalhada

Implementar no frontend os fluxos de autenticação e onboarding OAuth com seleção de provedor, callback, tratamento de erro e manutenção de sessão com refresh.

Escopo de UCs:

- UC-001, UC-002, UC-003
- UC-017, UC-018, UC-019
- UC-043, UC-044

Regras-chave:

- Seleção de provedor habilitado.
- Tratamento visual de sucesso/erro no callback OAuth.
- Sessão resiliente no cliente com retry em `401` e fallback para novo login.
- Gate UX obrigatório para todos os fluxos de autenticação.

## Critérios de Aceitação

- [ ] Tela/fluxo de seleção de provedor implementado.
- [ ] Onboarding inicial de usuário/palestrante integrado ao fluxo OAuth.
- [ ] Callback e estados de erro/sucesso refletidos corretamente na UI.
- [ ] Renovação de sessão no cliente sem logout indevido em cenários válidos.
- [ ] Fluxos de erro exibem mensagens claras e acionáveis.
- [ ] Testes de interface e fluxo crítico atualizados.
- [ ] Documentação funcional atualizada quando necessário.

## Notas Técnicas

- Integrar com `src/infrastructure/api/apiClient.ts` e política de refresh existente.
- Respeitar contexto de autenticação em `src/presentation/contexts/AuthProvider.tsx`.
- Evitar lógica de negócio em componentes; priorizar hooks/services.

## Mockups / Diagramas

- Referenciar fluxos de `docs/assets/OAuth.md`.

## Estimativa de Esforço

- XL (1-2 semanas)

## Requisitos Relacionados

- [x] RF-020 a RF-022 (OAuth Authentication)
- [x] Novo requisito (não documentado)

## Referências

- docs/case/UC-001-login-sessao-segura.md
- docs/case/UC-002-auto-cadastro-usuario.md
- docs/case/UC-003-ativacao-conta-palestrante.md
- docs/case/UC-017-renovar-sessao-token.md
- docs/case/UC-018-enviar-link-ativacao-usuario.md
- docs/case/UC-019-ativar-conta-usuario.md
- docs/case/UC-043-selecionar-provedor-oauth.md
- docs/case/UC-044-processar-callback-oauth-pkce.md

## Checklist do Solicitante

- [x] Verifiquei que esta funcionalidade não está duplicada em outra issue
- [x] Consultei a documentação do projeto em /docs
- [x] Esta funcionalidade está alinhada com o roadmap do projeto
