# [TECH]: Backend — OAuth Multi-provedor, Callback PKCE e Gestão de Sessão

## Template Utilizado

- .github/ISSUE_TEMPLATE/03-technical-task.yml

## Tipo de Tarefa

- Melhoria de segurança

## Prioridade

- P0 - Crítica (bloqueante)

## Módulo/Camada

- Múltiplos módulos

## Situação Atual

A documentação de casos de uso e escopo exige OAuth 2.0 (Authorization Code + PKCE), onboarding federado e rotação de refresh token. É necessário consolidar/adequar implementação backend para esses fluxos com rastreabilidade formal.

## Solução Proposta

Implementar/adequar no backend:

- Início de autorização por provedor.
- Processamento de callback com validação de `state` e PKCE.
- Vinculação de identidade federada ao usuário local.
- Política de refresh token com rotação e invalidação por reuso.

Escopo de UCs:

- UC-001, UC-002, UC-003
- UC-017, UC-018, UC-019
- UC-043, UC-044

## Benefícios

- Segurança de autenticação compatível com OAuth moderno.
- Redução de risco de sequestro de sessão.
- Consistência entre documentação e API.
- Melhor auditabilidade de acesso.

## Riscos e Impactos

- Alterações em contratos de autenticação e sessão.
- Dependência de configuração correta por provedor.
- Necessidade de regressão em fluxos de login existentes.

## Detalhes Técnicos

**Camadas afetadas:**

- Application (use cases de auth)
- Infrastructure (providers OAuth, token services)
- Presentation (controllers/routes de auth)

**Pontos de atenção:**

- Não expor tokens no frontend.
- Cookies HttpOnly/Secure/SameSite para sessão.
- Observabilidade de falhas de callback.

## Critérios de Aceitação

- [ ] Fluxo OAuth por provedor funcional no backend.
- [ ] Callback valida `state` e PKCE antes de troca de token.
- [ ] Primeiro acesso cria/vincula identidade federada corretamente.
- [ ] Refresh token rotaciona e detecta reuso.
- [ ] Testes de use case e integração cobrindo sucesso/falhas.
- [ ] Swagger e documentação técnica atualizados.

## Estimativa de Esforço

- XL (1-2 semanas)

## Áreas Relacionadas

- [x] Authentication/Authorization
- [x] API REST / Swagger
- [x] Testes automatizados
- [x] Clean Architecture / DDD

## Estratégia de Testes

- Unitários para use cases de auth/callback/refresh.
- Integração para rotas de login/callback/refresh/logout.
- Casos de falha: state inválido, code inválido, refresh expirado/reusado.

## Plano de Migração

1. Implementar feature flag/compatibilidade temporária se necessário.
2. Atualizar rotas e contratos.
3. Executar suíte de regressão auth.
4. Publicar documentação atualizada.

## Referências

- docs/assets/OAuth.md
- docs/case/UC-001-login-sessao-segura.md
- docs/case/UC-017-renovar-sessao-token.md
- docs/case/UC-044-processar-callback-oauth-pkce.md

## Checklist

- [x] Esta tarefa está alinhada com a arquitetura do projeto
- [x] Considerei o impacto em código existente
- [x] Defini critérios claros de aceitação
