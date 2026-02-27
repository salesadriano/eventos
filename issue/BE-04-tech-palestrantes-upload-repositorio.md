# [TECH]: Backend — Palestrantes, Upload e Repositórios de Arquivos

## Template Utilizado

- .github/ISSUE_TEMPLATE/03-technical-task.yml

## Tipo de Tarefa

- Melhoria de arquitetura

## Prioridade

- P1 - Alta (importante)

## Módulo/Camada

- Múltiplos módulos

## Situação Atual

Os UCs preveem gestão completa de palestrantes, upload de apresentações e configuração de repositório ativo (local/Drive/S3) com credenciais e validação de conexão.

## Solução Proposta

Implementar/ajustar backend para:

- CRUD completo de dados de palestrante.
- Pipeline de upload com validação e vínculo contextual.
- Configuração e credenciais do repositório ativo.
- Teste de conectividade do repositório.

Escopo de UCs:

- UC-012, UC-013, UC-014, UC-015
- UC-026
- UC-033, UC-034, UC-035, UC-036, UC-037, UC-038, UC-039, UC-040, UC-041, UC-042

## Benefícios

- Governança de conteúdo de evento com trilha técnica clara.
- Flexibilidade de storage por ambiente/cliente.
- Redução de falhas operacionais de upload.

## Riscos e Impactos

- Dependência de APIs externas (Drive/S3).
- Risco de exposição de credenciais se políticas não forem seguidas.

## Detalhes Técnicos

**Camadas afetadas:**

- Application (use cases de palestrante/upload/repositório)
- Infrastructure (providers de storage e credenciais)
- Presentation (controllers/DTOs)

## Critérios de Aceitação

- [ ] CRUD de palestrante cobre dados básicos e complementares.
- [ ] Upload valida tipo/tamanho e persiste metadados.
- [ ] Seleção de repositório ativo funcional.
- [ ] Cadastro/atualização de credenciais protegido e auditável.
- [ ] Endpoint de validação de conexão operacional.
- [ ] Testes automatizados cobrindo integrações e falhas.

## Estimativa de Esforço

- XXL (2+ semanas)

## Áreas Relacionadas

- [x] Infrastructure Layer (Repositories, External APIs)
- [x] Application Layer (Use Cases, DTOs)
- [x] Authentication/Authorization
- [x] Testes automatizados

## Estratégia de Testes

- Unitários de validação de arquivo e configuração.
- Integração com stubs/mocks de storage.
- Testes de falha de credencial e indisponibilidade.

## Plano de Migração

1. Isolar interface de storage por provider.
2. Implementar validação e persistência de configuração ativa.
3. Executar regressão dos fluxos de upload.

## Referências

- docs/case/UC-013-upload-apresentacoes.md
- docs/case/UC-014-configurar-repositorio-arquivos.md
- docs/case/UC-026-validar-conexao-repositorio.md
- docs/case/UC-037-enviar-arquivo-repositorio-ativo.md
- docs/case/UC-042-atualizar-credenciais-repositorio.md

## Checklist

- [x] Esta tarefa está alinhada com a arquitetura do projeto
- [x] Considerei o impacto em código existente
- [x] Defini critérios claros de aceitação
