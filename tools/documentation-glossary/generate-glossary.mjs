import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT_FILE = path.join(ROOT, "docs", "GLOSSARIO_DOCUMENTACAO.md");
const SEARCH_DIRS = ["docs", "review", "issue"];
const EXTENSIONS = new Set([
  ".md",
  ".markdown",
  ".txt",
  ".html",
  ".htm",
  ".pdf",
]);

const BASE_TERMS = {
  ADR: {
    meaning: "Architecture Decision Record",
    usage: "Registro de decisoes arquiteturais relevantes do projeto.",
    links: ["https://adr.github.io/"],
  },
  API: {
    meaning: "Application Programming Interface",
    usage: "Contrato de comunicacao entre sistemas e componentes.",
    links: ["https://restfulapi.net/"],
  },
  AWS: {
    meaning: "Amazon Web Services",
    usage:
      "Plataforma cloud usada em cenarios de repositorio e infraestrutura.",
    links: ["https://aws.amazon.com/"],
  },
  BE: {
    meaning: "Back End",
    usage: "Camada de servicos, regras de negocio e integracoes server-side.",
    links: [],
  },
  "BE-XX": {
    meaning: "Padrao de issue de Back End",
    usage:
      "Identificador de tarefas/features backend no planejamento do projeto.",
    links: [],
  },
  CA: {
    meaning: "Criterio de Aceite",
    usage: "Condicoes objetivas de validacao de uma entrega.",
    links: [],
  },
  CI: {
    meaning: "Continuous Integration",
    usage: "Automacao de verificacoes e testes em mudancas de codigo.",
    links: ["https://docs.github.com/actions"],
  },
  "CI/CD": {
    meaning: "Continuous Integration / Continuous Deployment",
    usage: "Pipeline automatizada de integracao e entrega/deploy.",
    links: ["https://docs.github.com/actions"],
  },
  CORS: {
    meaning: "Cross-Origin Resource Sharing",
    usage: "Politica de compartilhamento de recursos entre origens web.",
    links: ["https://developer.mozilla.org/docs/Web/HTTP/CORS"],
  },
  CRUD: {
    meaning: "Create, Read, Update, Delete",
    usage: "Operacoes basicas de persistencia e manutencao de dados.",
    links: [],
  },
  DI: {
    meaning: "Dependency Injection",
    usage: "Padrao para inversao de controle e composicao de dependencias.",
    links: ["https://martinfowler.com/articles/injection.html"],
  },
  DTO: {
    meaning: "Data Transfer Object",
    usage: "Objeto de transporte de dados entre camadas.",
    links: [],
  },
  FA: {
    meaning: "Fluxo Alternativo",
    usage:
      "Variacao do fluxo principal em casos de excecao ou regra especifica.",
    links: [],
  },
  FE: {
    meaning: "Front End",
    usage: "Camada de interface e experiencia do usuario.",
    links: [],
  },
  "FE-XX": {
    meaning: "Padrao de issue de Front End",
    usage:
      "Identificador de tarefas/features frontend no planejamento do projeto.",
    links: [],
  },
  GCP: {
    meaning: "Google Cloud Platform",
    usage: "Plataforma cloud do Google usada em integracoes do projeto.",
    links: ["https://cloud.google.com/"],
  },
  ID: {
    meaning: "Identifier",
    usage: "Identificador unico de entidade, regra ou criterio.",
    links: [],
  },
  JWT: {
    meaning: "JSON Web Token",
    usage: "Token para autenticacao/autorizacao stateless.",
    links: ["https://datatracker.ietf.org/doc/html/rfc7519"],
  },
  OAUTH: {
    meaning: "Open Authorization",
    usage: "Framework de autorizacao para acesso delegado.",
    links: ["https://datatracker.ietf.org/doc/html/rfc6749"],
  },
  OIDC: {
    meaning: "OpenID Connect",
    usage: "Camada de identidade sobre OAuth 2.0.",
    links: ["https://openid.net/specs/openid-connect-core-1_0.html"],
  },
  P0: {
    meaning: "Prioridade 0",
    usage: "Item critico e bloqueante para o roadmap.",
    links: [],
  },
  PDF: {
    meaning: "Portable Document Format",
    usage: "Formato de documento amplamente utilizado para publicacao.",
    links: ["https://www.iso.org/standard/75839.html"],
  },
  PKCE: {
    meaning: "Proof Key for Code Exchange",
    usage: "Mecanismo de seguranca para OAuth Authorization Code.",
    links: ["https://datatracker.ietf.org/doc/html/rfc7636"],
  },
  QA: {
    meaning: "Quality Assurance",
    usage: "Validacao de qualidade por testes e criterios de aceite.",
    links: [],
  },
  "QA-XX": {
    meaning: "Padrao de issue de Quality Assurance",
    usage:
      "Identificador de tarefas de testes e validacao no planejamento do projeto.",
    links: [],
  },
  REST: {
    meaning: "Representational State Transfer",
    usage: "Estilo arquitetural para APIs HTTP.",
    links: ["https://restfulapi.net/"],
  },
  RF: {
    meaning: "Requisito Funcional",
    usage: "Comportamento funcional esperado do sistema.",
    links: [],
  },
  RN: {
    meaning: "Regra de Negocio",
    usage: "Regra que governa comportamento de processos e validacoes.",
    links: [],
  },
  RNF: {
    meaning: "Requisito Nao Funcional",
    usage:
      "Qualidades e restricoes do sistema (performance, usabilidade etc.).",
    links: [],
  },
  SMTP: {
    meaning: "Simple Mail Transfer Protocol",
    usage: "Protocolo de envio de e-mails.",
    links: ["https://datatracker.ietf.org/doc/html/rfc5321"],
  },
  SHEETS: {
    meaning: "Google Sheets",
    usage: "Persistencia principal do projeto para dados operacionais.",
    links: ["https://developers.google.com/sheets/api"],
  },
  TS: {
    meaning: "TypeScript",
    usage: "Superset tipado de JavaScript para desenvolvimento web.",
    links: ["https://www.typescriptlang.org/docs/"],
  },
  TSX: {
    meaning: "TypeScript + JSX",
    usage: "Sintaxe usada em componentes React com tipagem TypeScript.",
    links: ["https://react.dev/learn/writing-markup-with-jsx"],
  },
  UC: {
    meaning: "Use Case",
    usage: "Descricao de fluxo de negocio orientado a objetivo do usuario.",
    links: [],
  },
  UI: {
    meaning: "User Interface",
    usage: "Camada visual e interativa da aplicacao.",
    links: ["https://www.interaction-design.org/literature/topics/ui-design"],
  },
  URL: {
    meaning: "Uniform Resource Locator",
    usage: "Endereco de recurso web.",
    links: [
      "https://developer.mozilla.org/docs/Learn/Common_questions/What_is_a_URL",
    ],
  },
  US: {
    meaning: "User Story",
    usage: "Descricao de necessidade do usuario em linguagem de negocio.",
    links: [],
  },
  UX: {
    meaning: "User Experience",
    usage: "Experiencia global do usuario durante interacoes com o sistema.",
    links: ["https://www.nngroup.com/articles/definition-user-experience/"],
  },
  WCAG: {
    meaning: "Web Content Accessibility Guidelines",
    usage: "Diretrizes de acessibilidade para conteudo web.",
    links: ["https://www.w3.org/WAI/standards-guidelines/wcag/"],
  },
};

function isTextExt(ext) {
  return ext !== ".pdf";
}

function listFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (EXTENSIONS.has(ext)) out.push(full);
      }
    }
  }
  return out;
}

function readPdfSearchable(filePath) {
  try {
    const output = execSync(`pdftotext -layout "${filePath}" -`, {
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    });
    return output || "";
  } catch {
    return "";
  }
}

function readDocument(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (isTextExt(ext)) {
    try {
      return fs.readFileSync(filePath, "utf8");
    } catch {
      return "";
    }
  }
  return readPdfSearchable(filePath);
}

function normalizeTerm(raw) {
  return raw
    .trim()
    .replace(/[()\[\]{}:;,]/g, "")
    .replace(/\.$/, "")
    .toUpperCase();
}

function extractTerms(text) {
  const terms = new Set();
  const regex = /\b[A-Z]{2,}(?:\/[A-Z]{2,})?\b/g;
  let match;
  while ((match = regex.exec(text))) {
    const term = normalizeTerm(match[0]);
    if (term.length <= 1) continue;
    terms.add(term);
  }
  if (text.includes("CI/CD")) terms.add("CI/CD");
  return terms;
}

function collectReferences(files, termsSet) {
  const refs = new Map();
  for (const term of termsSet) refs.set(term, []);

  for (const absPath of files) {
    const rel = path.relative(ROOT, absPath).replaceAll("\\", "/");
    const content = readDocument(absPath);
    if (!content) continue;
    const lines = content.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const term of termsSet) {
        if (line.includes(term)) {
          const arr = refs.get(term);
          if (arr.length < 3) {
            arr.push(`${rel}#L${i + 1}`);
          }
        }
      }
    }
  }

  return refs;
}

function createGlossaryContent(records) {
  const today = new Date().toISOString().slice(0, 10);

  const header = [
    "# Glossario Documental do Projeto",
    "",
    `Gerado automaticamente em ${today} a partir de documentos em docs/, issue/ e review/.`,
    "",
    "Este arquivo consolida termos e siglas usados na documentacao com significado e contexto de uso.",
    "",
    "## Termos e Siglas",
    "",
    "| Termo/Sigla | Significado | Utilizacao na documentacao | Referencias |",
    "| --- | --- | --- | --- |",
  ];

  const rows = records.map((r) => {
    const refText = r.references.length
      ? r.references.map((x) => `[${x}](${x})`).join("<br>")
      : "Sem referencia mapeada";
    const links = r.links.length
      ? `<br>Links: ${r.links.map((u) => `[fonte](${u})`).join(" | ")}`
      : "";

    return `| ${r.term} | ${r.meaning} | ${r.usage}${links} | ${refText} |`;
  });

  const footer = [
    "",
    "## Notas",
    "",
    "- Termos sem definicao consolidada devem ser revisados manualmente.",
    "- Para PDFs nao pesquisaveis, recomenda-se OCR antes da execucao.",
  ];

  return [...header, ...rows, ...footer].join("\n");
}

function main() {
  const files = SEARCH_DIRS.flatMap((dir) => listFiles(path.join(ROOT, dir)));

  const found = new Set();
  for (const absPath of files) {
    const content = readDocument(absPath);
    if (!content) continue;
    for (const term of extractTerms(content)) {
      if (BASE_TERMS[term]) found.add(term);
    }
  }

  for (const term of Object.keys(BASE_TERMS)) {
    found.add(term);
  }

  const references = collectReferences(files, found);

  const records = [...found]
    .sort((a, b) => a.localeCompare(b, "pt-BR"))
    .map((term) => ({
      term,
      meaning: BASE_TERMS[term]?.meaning ?? "Revisao humana necessaria",
      usage: BASE_TERMS[term]?.usage ?? "Revisao humana necessaria",
      links: BASE_TERMS[term]?.links ?? [],
      references: references.get(term) ?? [],
    }));

  const content = createGlossaryContent(records);
  fs.writeFileSync(OUTPUT_FILE, content, "utf8");
  console.log(`Glossario atualizado em ${path.relative(ROOT, OUTPUT_FILE)}`);
}

main();
