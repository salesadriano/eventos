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
- **[OBRIGATÓRIO]** A implementação visual **DEVE** seguir rigorosamente o mockup `docs/images/login.png`.

## Guia Visual Obrigatório

Esta issue **DEVE** ser implementada seguindo o mockup visual definido em:

- **Arquivo de referência**: [docs/images/login.png](docs/DEFINICAO_LAYOUTS_PAGINAS.md#92-página-de-acesso-auth-login-cadastro)
- **Seção do documento**: `docs/DEFINICAO_LAYOUTS_PAGINAS.md` — Seção 9.2 (Página de Acesso)
- **Estado de carregamento**: Seção 5.4 (Estado de Carregamento de Autenticação)

Qualquer implementação que desviar da estrutura visual definida no mockup **DEVE** ser:

1. Explicitamente documentada como exceção
2. Validada e aprovada pelo **UX Expert** antes de aceitar a issue
3. Incluir justificativa técnica ou de negócio para o desvio

## Critérios de Aceitação

### Obrigatoriedade de Conformidade Visual

> **⚠️ VINCULANTE:** Toda a implementação **DEVE** seguir rigorosamente o mockup visual `docs/images/login.png` conforme especificado na Seção 9.2 de `docs/DEFINICAO_LAYOUTS_PAGINAS.md`. Qualquer desvio visual ou estrutural deve ser explicitamente justificado e validado pelo **UX Expert** antes de ser considerado aceito.

### Critérios Funcionais

- [ ] **[VISUAL]** Layout implementado segue exatamente o mockup `docs/images/login.png` (Seção 9.2).
- [ ] **[VISUAL]** Shell centralizado sem header/footer institucionais está conforme especificado.
- [ ] **[VISUAL]** Card de autenticação apresenta os elementos na ordem correta: título, formulário, alternância modo, opções OAuth.
- [ ] Tela/fluxo de seleção de provedor implementado com os provedores habilitados.
- [ ] Onboarding inicial de usuário/palestrante integrado ao fluxo OAuth.
- [ ] Callback e estados de erro/sucesso refletidos corretamente na UI (conforme mockup de loading em Seção 5.4).
- [ ] Renovação de sessão no cliente sem logout indevido em cenários válidos.
- [ ] Fluxos de erro exibem mensagens claras e acionáveis.
- [ ] Testes de interface e fluxo crítico atualizados.
- [ ] Documentação funcional atualizada quando necessário.
- [ ] **[UX GATE]** Fluxo completo de autenticação validado e aprovado pelo UX Expert.

## Notas Técnicas

- Integrar com `src/infrastructure/api/apiClient.ts` e política de refresh existente.
- Respeitar contexto de autenticação em `src/presentation/contexts/AuthProvider.tsx`.
- Evitar lógica de negócio em componentes; priorizar hooks/services.

## Mockups / Diagramas

### Referências Visuais de Layout

- **Layout da Página de Acesso**: `docs/DEFINICAO_LAYOUTS_PAGINAS.md` (Seções 5.3 e 9.2)
- **Mockup de referência**: `docs/images/login.png`
- **Estado de carregamento de sessão**: Seção 5.4 do documento de layouts
- **Fluxos OAuth**: `docs/assets/OAuth.md`

### Especificação de Layout (Seção 9.2)

**Estrutura da Página de Acesso (`/auth`, `/login`, `/cadastro`):**

1. Shell centralizado (sem header/footer institucionais)
2. Card de autenticação:
   - Título contextual ("Faça Login" ou "Crie Sua Conta")
   - Formulário de login (e-mail/senha)
   - Alternância para autocadastro (inclui campo nome)
   - Botão de ação principal ("Entrar" ou "Cadastrar")
   - Botão de alternância de modo
   - Opções OAuth por provedor (Google, Microsoft, etc.)

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

## Dependências e Bloqueios

### Esta Issue Depende De

- **FE-05**: Design System (componentes base como Button, Input, Card, LoadingState e sistema de feedback visual são necessários para implementar os fluxos de autenticação)

### Esta Issue Bloqueia

- Nenhuma issue crítica bloqueada

## Checklist do Solicitante

- [x] Verifiquei que esta funcionalidade não está duplicada em outra issue
- [x] Consultei a documentação do projeto em /docs
- [x] Esta funcionalidade está alinhada com o roadmap do projeto
