# Plano de Precedência das Issues

Data base de início: **01/03/2026**

## Ordem proposta (com dependências)

| Ordem | Issue                                             | Início planejado | Dependências        |
| ----: | ------------------------------------------------- | ---------------- | ------------------- |
|     1 | BE-01 — OAuth backend                             | 01/03/2026       | —                   |
|     2 | FE-01 — OAuth frontend                            | 04/03/2026       | BE-01               |
|     3 | BE-02 — Eventos/programação backend               | 08/03/2026       | BE-01               |
|     4 | FE-02 — Eventos/programação frontend              | 10/03/2026       | BE-02               |
|     5 | BE-04 — Palestrantes/upload/repositório backend   | 13/03/2026       | BE-01               |
|     6 | FE-04 — Palestrantes/upload/repositório frontend  | 15/03/2026       | BE-04               |
|     7 | BE-03 — Inscrições/presença/certificação backend  | 19/03/2026       | BE-02               |
|     8 | FE-03 — Inscrições/presença/certificação frontend | 22/03/2026       | BE-03, FE-02        |
|     9 | QA-01 — Cobertura de testes                       | 27/03/2026       | Todas as anteriores |

## Observações

- Dependências foram organizadas para reduzir retrabalho de contratos API.
- FE sempre sucede BE no mesmo domínio funcional.
- QA consolidada ao final para regressão cruzada e evidência de cobertura.
