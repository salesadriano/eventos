# [FEATURE]: Frontend — Inscrições, Presença e Certificação

## Template Utilizado

- .github/ISSUE_TEMPLATE/01-feature-request.yml

## Prioridade

- P1 - Alta (importante)

## Módulo

- Outro

## Epic / Fase do Roadmap

- Fase 2: Gestão - Admin e Relatórios

## História de Usuário

Como usuário e operador
Eu quero gerenciar inscrições, presença e emissão de certificados
Para que o ciclo operacional do evento seja executado ponta a ponta.

## Descrição Detalhada

Implementar no frontend os fluxos de:

- Inscrição por evento/atividade (todas ou individual).
- Registro de presença por evento/atividade.
- Emissão de certificado por evento e por atividade (individual e em lote).

Escopo de UCs:

- UC-006, UC-007, UC-008
- UC-009, UC-010, UC-011
- UC-023, UC-024, UC-025
- UC-027, UC-028, UC-029, UC-030, UC-031, UC-032

## Guia Visual Obrigatório

Esta issue **DEVE** ser implementada seguindo os mockups visuais definidos em:

- **Arquivo de referência principal**: [docs/images/inscrição.png](docs/DEFINICAO_LAYOUTS_PAGINAS.md#95-página-de-detalhes-do-evento-para-participantes)
- **Seção do documento**: `docs/DEFINICAO_LAYOUTS_PAGINAS.md` — Seção 9.5 (Detalhes do Evento para Participantes)
- **Operações no Dashboard**: Seção 9.3, Bloco 5 (Painel Operacional MVP)

Qualquer implementação que desviar da estrutura visual definida nos mockups **DEVE** ser:

1. Explicitamente documentada como exceção
2. Validada e aprovada pelo **UX Expert** antes de aceitar a issue
3. Incluir justificativa técnica ou de negócio para o desvio

## Critérios de Aceitação

### Obrigatoriedade de Conformidade Visual

> **⚠️ VINCULANTE:** Toda a implementação **DEVE** seguir rigorosamente o mockup visual `docs/images/inscrição.png` conforme especificado na Seção 9.5 de `docs/DEFINICAO_LAYOUTS_PAGINAS.md`.

### Critérios Funcionais

- [ ] **[VISUAL]** Botão CTA "Inscrever-se Agora" segue exatamente o layout do mockup.
- [ ] **[VISUAL]** Estados condicionais (não autenticado, autenticado, já inscrito, encerrado) apresentam feedbacks conforme mockup.
- [ ] **[VISUAL]** Formulários de inscrição e presença no Dashboard seguem estrutura definida (Seção 9.3, Bloco 5).
- [ ] Inscrição por evento/atividade (todas ou individual) funcional na UI.
- [ ] Registro de presença por evento/atividade operante.
- [ ] Emissão de certificado por evento e por atividade (individual e em lote) implementada.
- [ ] Autoemissão individual e em lote disponível para usuário elegível.
- [ ] Emissão por atividade respeita presença confirmada por atividade.
- [ ] Feedback de erro/sucesso claro em todos os fluxos.
- [ ] **[UX GATE]** Fluxos críticos de inscrição, presença e certificação validados e aprovados pelo UX Expert.

- [ ] Inscrição por atividade reflete corretamente a configuração administrativa.
- [ ] Registro de presença por evento e atividade funcional na UI.
- [ ] Emissão de certificados exibe somente itens elegíveis.
- [ ] Autoemissão individual e em lote disponível para usuário elegível.
- [ ] Emissão por atividade respeita presença confirmada por atividade.
- [ ] Feedback de erro/sucesso claro em todos os fluxos.
- [ ] Gate UX validado para fluxos críticos.

## Notas Técnicas

- Reutilizar componentes e padrões de tabela/listagem existentes.
- Tratar estados de loading, vazio e erro de forma consistente.
- Garantir rastreabilidade de status da inscrição/presença na UI.

## Mockups / Diagramas

### Referências Visuais de Layout

- **Layout de Detalhes do Evento (visão participante)**: `docs/DEFINICAO_LAYOUTS_PAGINAS.md` (Seção 9.5)
- **Layout do Dashboard (operações MVP)**: Seção 9.3 (bloco 5 - Painel Operacional)
- **Mockup de referência**: `docs/images/inscrição.png`
- **Fluxos de negócio**: UCs do bloco EP03/EP04

### Especificação de Layout Relevante

**Da Página de Detalhes (Seção 9.5) - Relacionado a Inscrição:**

- Botão CTA Principal: "Inscrever-se Agora"
- Lógica condicional:
  - Não autenticado: redireciona para `/auth`
  - Autenticado: executa inscrição ou abre modal
  - Já inscrito: badge "Você está inscrito" + opção cancelar
  - Evento encerrado/lotado: botão desabilitado
- Programação com opção de inscrição por atividade (se RF15 habilitado)

**Do Dashboard (Seção 9.3, Bloco 5) - Operações MVP:**

- Formulário de Inscrição (seletor de evento, CPF, atividades)
- Formulário de Presença (seletor de evento, CPF, checkboxes)
- Indicadores Resumidos (inscrições, presenças, elegíveis)

## Estimativa de Esforço

- XXL (2+ semanas)

## Requisitos Relacionados

- [x] RF-001 a RF-013 (Requisitos Base)
- [x] Novo requisito (não documentado)

## Referências

- docs/case/UC-006-configurar-inscricao-atividade.md
- docs/case/UC-007-inscricao-evento-atividades.md
- docs/case/UC-008-registro-presenca.md
- docs/case/UC-009-emissao-certificado-evento.md
- docs/case/UC-010-autoemissao-lote-certificados.md
- docs/case/UC-011-certificado-por-atividade.md
- docs/case/UC-023-inscricao-todas-atividades.md
- docs/case/UC-024-inscricao-individual-atividades.md
- docs/case/UC-025-registrar-presenca-atividade.md
- docs/case/UC-027-validar-elegibilidade-certificado-evento.md
- docs/case/UC-028-gerar-download-certificado-evento.md
- docs/case/UC-029-listar-elegiveis-certificados.md
- docs/case/UC-030-emitir-certificados-lote-eventos.md
- docs/case/UC-031-validar-elegibilidade-certificado-atividade.md
- docs/case/UC-032-emitir-certificados-lote-atividades.md

## Dependências e Bloqueios

### Esta Issue Depende De

- **FE-05**: Design System (componentes de formulário, tabelas/listagens, feedback de sucesso/erro, loading states e sistema de alertas são necessários para fluxos de inscrição, presença e certificação)
- **FE-02**: Gestão de Eventos (eventos precisam estar cadastrados antes de gerenciar inscrições)

### Esta Issue Bloqueia

- Ciclo operacional completo de eventos

## Checklist do Solicitante

- [x] Verifiquei que esta funcionalidade não está duplicada em outra issue
- [x] Consultei a documentação do projeto em /docs
- [x] Esta funcionalidade está alinhada com o roadmap do projeto
