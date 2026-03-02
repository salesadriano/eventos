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

## Guia Visual Obrigatório

Esta issue **DEVE** ser implementada seguindo os mockups visuais definidos em:

- **Arquivo de referência 1**: [docs/images/palestrantes.png](docs/DEFINICAO_LAYOUTS_PAGINAS.md#97-página-de-cadastroedição-de-palestrante)
- **Arquivo de referência 2**: [docs/images/uploadarquivos.png](docs/DEFINICAO_LAYOUTS_PAGINAS.md#98-página-de-configuração-de-repositório-de-arquivos)
- **Seção do documento**: `docs/DEFINICAO_LAYOUTS_PAGINAS.md` — Seções 9.7 (Palestrantes) e 9.8 (Repositório)
- **Operações no Dashboard**: Seção 9.3, Bloco 6 (Painel de Palestrantes)

Qualquer implementação que desviar da estrutura visual definida nos mockups **DEVE** ser:

1. Explicitamente documentada como exceção
2. Validada e aprovada pelo **UX Expert** antes de aceitar a issue
3. Incluir justificativa técnica ou de negócio para o desvio

## Critérios de Aceitação

### Obrigatoriedade de Conformidade Visual

> **⚠️ VINCULANTE:** Toda a implementação **DEVE** seguir rigorosamente os mockups visuais `docs/images/palestrantes.png` e `docs/images/uploadarquivos.png` conforme especificado nas Seções 9.7 e 9.8 de `docs/DEFINICAO_LAYOUTS_PAGINAS.md`.

### Critérios Funcionais

- [ ] **[VISUAL]** Formulário de palestrante segue exatamente o layout do mockup `docs/images/palestrantes.png` (Seção 9.7).
- [ ] **[VISUAL]** Página de configuração de repositório segue exatamente o layout do mockup `docs/images/uploadarquivos.png` (Seção 9.8).
- [ ] **[VISUAL]** Opções de repositório (Local, Google Drive, AWS S3) apresentadas conforme especificado.
- [ ] Fluxo de cadastro/edição de palestrante completo na UI.
- [ ] Upload de apresentação com validação de tipo/tamanho e feedback visual.
- [ ] Seleção de repositório ativo e cadastro/edição de credenciais na interface operante.
- [ ] Teste de conexão do repositório com retorno visual claro (sucesso/erro).
- [ ] Controle de visibilidade/permissão por perfil implementado.
- [ ] Nenhum segredo exposto em tela ou logs.
- [ ] **[UX GATE]** Fluxos de cadastro de palestrantes, upload e configuração de repositório validados e aprovados pelo UX Expert.

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

### Referências Visuais de Layout

- **Layout de Cadastro/Edição de Palestrante**: `docs/DEFINICAO_LAYOUTS_PAGINAS.md` (Seção 9.7)
- **Layout de Configuração de Repositório**: Seção 9.8
- **Layout do Dashboard (painel palestrantes)**: Seção 9.3 (bloco 6)
- **Mockups de referência**:
  - `docs/images/palestrantes.png`
  - `docs/images/uploadarquivos.png`
- **Fluxos de negócio**: docs/case/UC-012 a UC-042

### Especificação de Layout (Seções 9.7 e 9.8)

**Página de Cadastro/Edição de Palestrante (9.7):**

1. Cabeçalho Administrativo
2. Título: "Cadastrar Novo Palestrante" ou "Editar Palestrante: [Nome]"
3. Formulário:
   - Nome Completo, Foto de Perfil, Biográfico/Mini Currículo
   - Redes Sociais (LinkedIn, Twitter, Instagram, etc.)
   - Contato (E-mail)
   - Área para upload de arquivos de apresentação (RF10)
4. Botões: "Salvar Palestrante", "Cancelar"
5. Rodapé simplificado

**Página de Configuração de Repositório (9.8):**

1. Cabeçalho Administrativo
2. Título: "Configuração de Repositório de Arquivos"
3. Opções de Repositório: Radio buttons (Local, Google Drive, AWS S3)
4. Campos de Credenciais (condicionais por tipo selecionado)
5. Botão "Testar Conexão" (CA10) - validação
6. Botões: "Salvar Configuração", "Cancelar"
7. Rodapé simplificado

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

## Dependências e Bloqueios

### Esta Issue Depende De

- **FE-05**: Design System (componentes de formulário, upload de arquivos, feedback de validação, configuração administrativa e estados de loading são necessários para gestão de palestrantes e repositório)

### Esta Issue Bloqueia

- Gestão completa de conteúdo dos eventos

## Checklist do Solicitante

- [x] Verifiquei que esta funcionalidade não está duplicada em outra issue
- [x] Consultei a documentação do projeto em /docs
- [x] Esta funcionalidade está alinhada com o roadmap do projeto
