# [FEATURE]: Frontend — Gestão de Eventos, Programação e Identidade Visual

## Template Utilizado

- .github/ISSUE_TEMPLATE/01-feature-request.yml

## Prioridade

- P1 - Alta (importante)

## Módulo

- Outro

## Epic / Fase do Roadmap

- Fase 1: Core - Editais e Lotes

## História de Usuário

Como administrador
Eu quero criar e manter eventos com programação e imagens de identidade visual
Para que a experiência da aplicação e dos certificados reflita a identidade do evento.

## Descrição Detalhada

Implementar no frontend o CRUD de eventos com suporte a:

- Programação opcional.
- Campos de imagem do header da aplicação e cabeçalho do certificado.
- Listagem com filtros/paginação.

Escopo de UCs:

- UC-004, UC-005
- UC-020, UC-021, UC-022

## Guia Visual Obrigatório

Esta issue **DEVE** ser implementada seguindo os mockups visuais definidos em:

- **Arquivo de referência principal**: [docs/images/eventos.png](docs/DEFINICAO_LAYOUTS_PAGINAS.md#96-página-de-cadastroedição-de-evento)
- **Seção do documento**: `docs/DEFINICAO_LAYOUTS_PAGINAS.md` — Seção 9.6 (Cadastro/Edição de Evento)
- **Listagem e filtros**: Seção 5.2 do documento (no contexto do Dashboard em FE-08)

Qualquer implementação que desviar da estrutura visual definida nos mockups **DEVE** ser:

1. Explicitamente documentada como exceção
2. Validada e aprovada pelo **UX Expert** antes de aceitar a issue
3. Incluir justificativa técnica ou de negócio para o desvio

## Critérios de Aceitação

### Obrigatoriedade de Conformidade Visual

> **⚠️ VINCULANTE:** Toda a implementação **DEVE** seguir rigorosamente o mockup visual `docs/images/eventos.png` conforme especificado na Seção 9.6 de `docs/DEFINICAO_LAYOUTS_PAGINAS.md`.

### Critérios Funcionais

- [ ] **[VISUAL]** Formulário de evento segue exatamente o layout do mockup `docs/images/eventos.png`.
- [ ] **[VISUAL]** Seção de Programação apresenta estrutura conforme especificada (botão, lista, campos).
- [ ] Formulário de evento contempla os dois campos de imagem (header app e cabeçalho certificado).
- [ ] Fluxo de criação/edição/exclusão de evento funcional na UI.
- [ ] Programação opcional configurável via interface.
- [ ] Lista de eventos com paginação e filtros operante.
- [ ] Validações visuais de campos e mensagens de erro consistentes.
- [ ] **[UX GATE]** Fluxo completo de CRUD validado e aprovado pelo UX Expert.

## Notas Técnicas

- Reutilizar padrões existentes de formulários e hooks de serviço.
- Centralizar chamadas API no serviço de eventos.
- Garantir compatibilidade visual responsiva.

## Mockups / Diagramas

### Referências Visuais de Layout

- **Layout de Cadastro/Edição de Evento**: `docs/DEFINICAO_LAYOUTS_PAGINAS.md` (Seção 9.6)
- **Mockup de referência**: `docs/images/eventos.png`
- **Fluxos de negócio**: `docs/case/UC-004-crud-eventos.md`

### Especificação de Layout (Seção 9.6)

**Estrutura da Página de Cadastro/Edição de Evento:**

1. Cabeçalho Administrativo (diferente do header público)
2. Título: "Cadastrar Novo Evento" ou "Editar Evento: [Nome]"
3. Formulário de Detalhes do Evento:
   - Nome, Descrição, Data/Hora (Início/Fim), Local, Preço, Categoria
   - Upload de Imagem para Header da Aplicação (CA17)
   - Upload de Imagem para Cabeçalho do Certificado (CA17)
4. Seção de Programação (Opcional):
   - Botão "Adicionar Atividade"
   - Lista de atividades com edição/exclusão
   - Para cada atividade: Nome, Descrição, Horário, Duração, Palestrante(s)
   - Opção de inscrição específica por atividade (RF15)
5. Botões: "Salvar Evento", "Cancelar"
6. Rodapé simplificado

## Estimativa de Esforço

- XL (1-2 semanas)

## Requisitos Relacionados

- [x] RF-001 a RF-013 (Requisitos Base)
- [x] Novo requisito (não documentado)

## Referências

- docs/case/UC-004-crud-eventos.md
- docs/case/UC-005-cadastro-programacao-evento.md
- docs/case/UC-020-criar-evento.md
- docs/case/UC-021-listar-filtrar-eventos.md
- docs/case/UC-022-atualizar-excluir-evento.md
- docs/DECLARACAO_ESCOPO.md

## Dependências e Bloqueios

### Esta Issue Depende De

- **FE-05**: Design System (componentes de formulário, cards de listagem, paginação, sistema de grid e tokens de espaçamento são necessários para CRUD de eventos)

### Esta Issue Bloqueia

- Funcionalidades de gestão operacional de eventos

## Checklist do Solicitante

- [x] Verifiquei que esta funcionalidade não está duplicada em outra issue
- [x] Consultei a documentação do projeto em /docs
- [x] Esta funcionalidade está alinhada com o roadmap do projeto
