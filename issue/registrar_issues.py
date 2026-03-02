#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path

REPO = "salesadriano/eventos"
BASE = Path(__file__).resolve().parent

@dataclass
class IssueDef:
    key: str
    file: str
    starts: str
    depends_on: list[str]

ISSUES: list[IssueDef] = [
    IssueDef("BE-01", "BE-01-tech-auth-oauth.md", "01/03/2026", []),
    IssueDef("FE-05", "FE-05-feature-design-system-implementacao.md", "01/03/2026", []),
    IssueDef("BE-02", "BE-02-tech-eventos-programacao.md", "08/03/2026", ["BE-01"]),
    IssueDef("BE-04", "BE-04-tech-palestrantes-upload-repositorio.md", "13/03/2026", ["BE-01"]),
    IssueDef("BE-03", "BE-03-tech-inscricoes-presencas-certificados.md", "19/03/2026", ["BE-02"]),
    IssueDef("FE-06", "FE-06-feature-pagina-inicial-publica.md", "25/03/2026", ["FE-05"]),
    IssueDef("FE-01", "FE-01-feature-auth-oauth.md", "25/03/2026", ["BE-01", "FE-05"]),
    IssueDef("FE-02", "FE-02-feature-eventos-programacao.md", "01/04/2026", ["BE-02", "FE-05"]),
    IssueDef("FE-07", "FE-07-feature-listagem-detalhes-eventos.md", "01/04/2026", ["FE-05", "FE-06"]),
    IssueDef("FE-04", "FE-04-feature-palestrantes-upload-repositorio.md", "08/04/2026", ["BE-04", "FE-05"]),
    IssueDef("FE-03", "FE-03-feature-inscricoes-presencas-certificados.md", "15/04/2026", ["BE-03", "FE-02", "FE-07", "FE-05"]),
    IssueDef("FE-08", "FE-08-feature-dashboard-administrativo.md", "22/04/2026", ["FE-05", "FE-01", "FE-06", "BE-02", "BE-03", "BE-04"]),
    IssueDef(
        "QA-01",
        "QA-01-testing-cobertura-ucs.md",
        "06/05/2026",
        [
            "BE-01",
            "FE-05",
            "BE-02",
            "BE-04",
            "BE-03",
            "FE-06",
            "FE-01",
            "FE-02",
            "FE-07",
            "FE-04",
            "FE-03",
            "FE-08",
        ],
    ),
]


def run(cmd: list[str]) -> str:
    out = subprocess.check_output(cmd, text=True)
    return out.strip()


def run_json(cmd: list[str]) -> list[dict]:
    out = run(cmd)
    if not out:
        return []
    return json.loads(out)


def title_from(md: str) -> str:
    first = md.splitlines()[0].strip()
    return re.sub(r"^#\s*", "", first)


def find_existing_issue_number(key: str, title: str) -> int | None:
    by_key = run_json(
        [
            "gh",
            "issue",
            "list",
            "--repo",
            REPO,
            "--state",
            "all",
            "--search",
            f'"Chave de rastreio: {key}" in:body',
            "--json",
            "number",
            "--limit",
            "1",
        ]
    )
    if by_key:
        return int(by_key[0]["number"])

    by_title = run_json(
        [
            "gh",
            "issue",
            "list",
            "--repo",
            REPO,
            "--state",
            "all",
            "--search",
            f'"{title}" in:title',
            "--json",
            "number,title",
            "--limit",
            "10",
        ]
    )
    for item in by_title:
        if item.get("title", "").strip() == title:
            return int(item["number"])

    return None


def body_with_plan(base_body: str, key_to_num: dict[str, int], issue: IssueDef) -> str:
    if issue.depends_on:
        deps = ", ".join(f"#{key_to_num[d]}" if d in key_to_num else d for d in issue.depends_on)
    else:
        deps = "—"

    plan = (
        "\n\n---\n"
        "## Dependências e Precedência\n"
        f"- Chave de rastreio: {issue.key}\n"
        f"- Marco de início planejado: {issue.starts}\n"
        f"- Depende de: {deps}\n"
    )
    return base_body.rstrip() + plan + "\n"


def main() -> None:
    key_to_num: dict[str, int] = {}
    cached_raw: dict[str, str] = {}

    for item in ISSUES:
        md = (BASE / item.file).read_text(encoding="utf-8")
        cached_raw[item.key] = md
        title = title_from(md)
        existing = find_existing_issue_number(item.key, title)

        if existing is not None:
            key_to_num[item.key] = existing
            print(f"{item.key} -> #{existing} (issue existente)")
            continue

        body = body_with_plan(md, key_to_num, item)

        tmp = BASE / f".tmp-{item.key}.md"
        tmp.write_text(body, encoding="utf-8")
        try:
            url = run([
                "gh", "issue", "create",
                "--repo", REPO,
                "--title", title,
                "--body-file", str(tmp),
            ])
            m = re.search(r"/issues/(\d+)", url)
            if not m:
                raise RuntimeError(f"Não foi possível extrair número da issue: {url}")
            key_to_num[item.key] = int(m.group(1))
            print(f"{item.key} -> #{key_to_num[item.key]} ({url})")
        finally:
            if tmp.exists():
                tmp.unlink()

    for item in ISSUES:
        num = key_to_num[item.key]
        final_body = body_with_plan(cached_raw[item.key], key_to_num, item)
        tmp = BASE / f".tmp-final-{item.key}.md"
        tmp.write_text(final_body, encoding="utf-8")
        try:
            run([
                "gh", "issue", "edit", str(num),
                "--repo", REPO,
                "--body-file", str(tmp),
            ])
        finally:
            if tmp.exists():
                tmp.unlink()

    print("\nRegistro concluído com dependências atualizadas.")


if __name__ == "__main__":
    main()
