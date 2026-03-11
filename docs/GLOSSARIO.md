# Glossário de Abreviações

Documento centralizado com todas as abreviações e siglas utilizadas no projeto `eventos`.

## Abreviações de Domínio Funcional

| Sigla  | Significado       | Contexto                                                          | Exemplo                       |
| ------ | ----------------- | ----------------------------------------------------------------- | ----------------------------- |
| **BE** | Back End          | Issues, planejamento e desenvolvimento server-side                | `BE-01 — OAuth backend`       |
| **FE** | Front End         | Issues, planejamento e desenvolvimento client-side (React + Vite) | `FE-01 — OAuth frontend`      |
| **QA** | Quality Assurance | Testes, validação e cobertura de testes                           | `QA-01 — Cobertura de testes` |
| **P0** | Prioridade 0      | Crítica e bloqueante — deve ser implementada primeiro             | `FE-05 é P0 CRÍTICA`          |

## Abreviações Técnicas

| Sigla     | Significado                       | Contexto                                        | Localização                                                |
| --------- | --------------------------------- | ----------------------------------------------- | ---------------------------------------------------------- |
| **DTO**   | Data Transfer Object              | Camada de apresentação e transferência de dados | `server/src/application/dtos/**`                           |
| **JWT**   | JSON Web Token                    | Autenticação e autorização                      | `authMiddleware`, `tokenStorage`                           |
| **OAuth** | Open Authorization                | Autenticação externa com provedores             | `UC-043`, `UC-044`                                         |
| **SMTP**  | Simple Mail Transfer Protocol     | Serviço de email (opcional, configurável)       | `server/src/config/environment.ts`                         |
| **CORS**  | Cross-Origin Resource Sharing     | Compartilhamento de recursos entre domínios     | _backend middleware_                                       |
| **API**   | Application Programming Interface | Interface REST para comunicação                 | Base: `/api`                                               |
| **REST**  | Representational State Transfer   | Padrão arquitetural de APIs                     | Todas as rotas em `server/src/presentation/http/routes/**` |
| **CRUD**  | Create, Read, Update, Delete      | Operações básicas de dados                      | `UC-004`, `UC-022`                                         |

## Abreviações de Persistência e Infraestrutura

| Sigla      | Significado           | Contexto                                          | Localização                                            |
| ---------- | --------------------- | ------------------------------------------------- | ------------------------------------------------------ |
| **Sheets** | Google Sheets         | Persistência principal do projeto                 | `server/src/infrastructure/google/SheetInitializer.ts` |
| **GCP**    | Google Cloud Platform | Plataforma de cloud (Google Sheets, autenticação) | `.env` (vars de ambiente)                              |

## Abreviações de Arquitetura

| Sigla   | Significado                  | Contexto                           | Localização                                        |
| ------- | ---------------------------- | ---------------------------------- | -------------------------------------------------- |
| **DI**  | Dependency Injection         | Padrão de injeção de dependências  | `server/src/container/index.ts` (`buildContainer`) |
| **ADR** | Architecture Decision Record | Registro de decisões arquiteturais | `review/*.md`                                      |
| **UC**  | Use Case                     | Casos de uso do sistema            | `docs/case/UC-*.md`                                |

## Abreviações de Padrões de Desenvolvimento

| Sigla     | Significado                                    | Contexto                               | Exemplo                              |
| --------- | ---------------------------------------------- | -------------------------------------- | ------------------------------------ |
| **TSX**   | TypeScript + JSX                               | Componentes React com tipagem          | `src/presentation/components/**.tsx` |
| **TS**    | TypeScript                                     | Código JavaScript com tipagem estática | Backend e frontend                   |
| **CI/CD** | Continuous Integration / Continuous Deployment | Automação de build e deploy            | _futuro_                             |

## Padrão de Issues (Planejamento do Projeto)

| Padrão    | Descrição                                                           | Exemplo                                                                                                                                              |
| --------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FE-XX** | Front End — Feature ou tarefa de interface (XX = número sequencial) | FE-01 OAuth, FE-02 Eventos/Programação, FE-05 Design System, FE-06 Página Inicial Pública, FE-07 Listagem de Eventos, FE-08 Dashboard Administrativo |
| **BE-XX** | Back End — Serviço ou API (XX = número sequencial)                  | BE-01 OAuth, BE-02 Eventos/Programação, BE-03 Inscrições/Presença/Certificação, BE-04 Palestrantes/Upload                                            |
| **QA-XX** | Quality Assurance — Testes e validação (XX = número sequencial)     | QA-01 Cobertura de Testes                                                                                                                            |

## Referências Rápidas

- **Arquivo de Precedência:** `/workspaces/eventos/issue/PLANO_PRECEDENCIA.md`
- **Casos de Uso:** `/workspaces/eventos/docs/case/UC-*.md`
- **Declaração de Escopo:** `/workspaces/eventos/docs/DECLARACAO_ESCOPO.md`
- **Modelo de Dados:** `/workspaces/eventos/docs/MODELO_DADOS.md`
- **Definição de Layouts:** `/workspaces/eventos/docs/DEFINICAO_LAYOUTS_PAGINAS.md`
