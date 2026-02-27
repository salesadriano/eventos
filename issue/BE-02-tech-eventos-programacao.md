# [TECH]: Backend — Eventos, Programação e Identidade Visual

## Template Utilizado

- .github/ISSUE_TEMPLATE/03-technical-task.yml

## Tipo de Tarefa

- Melhoria de arquitetura

## Prioridade

- P1 - Alta (importante)

## Módulo/Camada

- Múltiplos módulos

## Situação Atual

Os casos de uso de eventos evoluíram para incluir programação opcional e campos de identidade visual do evento (header da aplicação e cabeçalho do certificado). É necessário garantir persistência, validação e contrato API aderentes.

## Solução Proposta

Adequar backend para CRUD de eventos com suporte aos novos atributos e regras:

- `appHeaderImageUrl`
- `certificateHeaderImageUrl`

Escopo de UCs:

- UC-004, UC-005
- UC-020, UC-021, UC-022

## Benefícios

- Alinhamento completo com premissas funcionais do produto.
- Dados de evento preparados para renderização de UI e certificados.
- Redução de retrabalho entre frontend/backend.

## Riscos e Impactos

- Ajustes em DTOs e mapeadores podem afetar consumidores atuais.
- Necessidade de atualização de documentação de contratos.

## Detalhes Técnicos

**Camadas afetadas:**

- Domain (entidade Event)
- Application (DTOs/use cases)
- Infrastructure (repositório Google Sheets + mapeadores)
- Presentation (controllers e validações)

## Critérios de Aceitação

- [ ] Endpoints de evento aceitam e retornam os novos campos de imagem.
- [ ] Validações de formato/tamanho/presença opcional aplicadas conforme regra.
- [ ] Programação opcional mantida sem regressão.
- [ ] Testes de casos de uso de eventos atualizados.
- [ ] Documentação de API atualizada.

## Estimativa de Esforço

- L (3-5 dias)

## Áreas Relacionadas

- [x] Domain Layer (Entidades, Value Objects)
- [x] Application Layer (Use Cases, DTOs)
- [x] Infrastructure Layer (Repositories, External APIs)
- [x] API REST / Swagger

## Estratégia de Testes

- Unitários para validações de EventEntity.
- Integração de CRUD com novos campos.
- Regressão dos cenários existentes de listagem/filtro.

## Plano de Migração

1. Expandir DTOs e mapeadores.
2. Atualizar armazenamento da sheet `events`.
3. Ajustar endpoints e testes.
4. Atualizar docs de API.

## Referências

- docs/case/UC-004-crud-eventos.md
- docs/case/UC-020-criar-evento.md
- docs/case/UC-022-atualizar-excluir-evento.md
- docs/MODELO_DADOS.md

## Checklist

- [x] Esta tarefa está alinhada com a arquitetura do projeto
- [x] Considerei o impacto em código existente
- [x] Defini critérios claros de aceitação
