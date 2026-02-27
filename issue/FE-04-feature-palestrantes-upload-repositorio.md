# [FEATURE]: Frontend — Palestrantes, Upload e Configuração de Repositório

## Template Utilizado

- .github/ISSUE_TEMPLATE/01-feature-request.yml

## Prioridade

- P1 - Alta (importante)

## Módulo

- Infraestrutura

## Epic / Fase do Roadmap

- Fase 4: Avançado - Workflow e Integrações

## História de Usuário

Como administrador e palestrante
Eu quero manter perfis de palestrantes e subir apresentações para um repositório configurado
Para que os conteúdos do evento sejam centralizados com governança.

## Descrição Detalhada

Implementar no frontend:

- CRUD de dados de palestrantes (incluindo currículo/redes/contato).
- Fluxos de upload de apresentações com validações.
- Configuração de tipo de repositório e credenciais administrativas.

Escopo de UCs:

- UC-012, UC-013, UC-014, UC-015
- UC-026
- UC-033, UC-034, UC-035, UC-036, UC-037, UC-038, UC-039, UC-040, UC-041, UC-042

## Critérios de Aceitação

- [ ] Fluxo de cadastro/edição de palestrante completo na UI.
- [ ] Upload de apresentação com validação de tipo/tamanho e feedback.
- [ ] Seleção de repositório ativo e cadastro/edição de credenciais na interface.
- [ ] Teste de conexão do repositório com retorno visual claro.
- [ ] Controle de visibilidade/permiteção por perfil implementado.
- [ ] Gate UX validado para formulários e fluxos de upload/admin.

## Notas Técnicas

- Seguir separação entre camada de apresentação e serviços.
- Não expor segredos em tela/log.
- Tratar estados transientes de upload/configuração.

## Mockups / Diagramas

- Referência de fluxos: docs/case/UC-012..UC-042 relacionados.

## Estimativa de Esforço

- XXL (2+ semanas)

## Requisitos Relacionados

- [x] RF-001 a RF-013 (Requisitos Base)
- [x] Novo requisito (não documentado)

## Referências

- docs/case/UC-012-cadastro-palestrante.md
- docs/case/UC-013-upload-apresentacoes.md
- docs/case/UC-014-configurar-repositorio-arquivos.md
- docs/case/UC-015-gerir-credenciais-repositorio.md
- docs/case/UC-026-validar-conexao-repositorio.md
- docs/case/UC-033-cadastrar-dados-basicos-palestrante.md
- docs/case/UC-034-cadastrar-curriculo-redes-contato.md
- docs/case/UC-035-editar-perfil-palestrante.md
- docs/case/UC-036-validar-arquivo-apresentacao.md
- docs/case/UC-037-enviar-arquivo-repositorio-ativo.md
- docs/case/UC-038-vincular-apresentacao-contexto.md
- docs/case/UC-039-selecionar-tipo-repositorio.md
- docs/case/UC-040-salvar-repositorio-ativo.md
- docs/case/UC-041-cadastrar-credenciais-repositorio.md
- docs/case/UC-042-atualizar-credenciais-repositorio.md

## Checklist do Solicitante

- [x] Verifiquei que esta funcionalidade não está duplicada em outra issue
- [x] Consultei a documentação do projeto em /docs
- [x] Esta funcionalidade está alinhada com o roadmap do projeto
