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

## Critérios de Aceitação

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

- Basear em fluxos dos UCs do bloco EP03/EP04.

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

## Checklist do Solicitante

- [x] Verifiquei que esta funcionalidade não está duplicada em outra issue
- [x] Consultei a documentação do projeto em /docs
- [x] Esta funcionalidade está alinhada com o roadmap do projeto
