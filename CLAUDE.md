# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.

## What this repository is

This is **not a software application** — there is no source code to build, lint,
or test. It is **Germán Pablo Morvillo's** (GitHub: `sher414`) professional
portfolio and knowledge base for **Business Process Management, RPA, and
AI-driven automation**. Content is written almost entirely in **Spanish** and
mixes:

- BPMN process diagrams and modeling theory
- RPA artifacts (UiPath, Power Automate)
- n8n automation projects (exported workflow JSON + docs + screenshots)
- AI agent / prompt engineering / LLM configuration guides
- BPM documentation templates (PDD, SDD) and ROI material

There is no `package.json`, build step, test suite, or app to run. Treat every
change as a **documentation/content edit**, not a code change.

## Repository structure

```
.
├── README.md                     Portfolio landing page (overview + an appended
│                                  "Agentic Process" UiPath Maestro walkthrough
│                                  that uses images/*.png — historically pasted
│                                  on at the end of the same file, unrelated to
│                                  the section above it)
├── BPMN/                          BPMN theory, cheat sheets, example .bpmn files,
│                                  debugging screenshots, a UiPath certificate
├── BPMN-Software-Update.bpmn       Standalone BPMN diagram exported from UiPath
├── images/                        Screenshots referenced by the root README's
│                                  "Agentic Process" section
├── Power-Automate/                Power Automate Desktop/Cloud screenshots + notes
├── PDD-SDD/
│   ├── PDD/                       Process Definition Document: "what is it" doc,
│   │                              a blank template, and a worked example
│   └── SDD/                       Solution Design Document: same pattern
├── Digital-Transformation/        Concepts on when/whether to automate a process
│                                  (several files here are plain text WITHOUT a
│                                  .md/.txt extension — see "Known quirks" below)
├── N8N-Automatizaciones/          n8n automation work, the largest section:
│   ├── Automatizaciones/          Finished, end-to-end automation case studies,
│   │                              one subfolder per project (see pattern below)
│   ├── LABS/                      Learning/practice workflows (process > polish)
│   └── Recursos/                  Study material backing the practical projects
├── ConfigurarLLM/                 LLM provider comparison + parameter tuning
│                                  (temperature, top_p, etc.) + n8n agent patterns
├── ComoFuncionaAgenteIA/          "How AI agents work" conceptual writeup +
│                                  the CLARA / RCICE prompt-engineering framework
├── RedactarPrompt.LLM/            Shorter intro version of the CLARA method
├── ROI_Automatizaciones/          ROI formula, 4 worked case studies, a fill-in
│                                  template for documenting new ROI cases
├── docs/references.md             Curated external links (BPMN spec, UiPath
│                                  docs, BABOK, Scrum Guide, etc.)
└── .github/workflows/             A generic, unused npm-publish-github-packages
                                   template — not wired to anything (no
                                   package.json exists). Don't treat it as a
                                   real CI signal.
```

## Conventions to follow

### Project-folder pattern (`N8N-Automatizaciones/Automatizaciones/<Project>/`)

Each finished automation case study follows this shape — match it when adding
a new one:

```
<Project>/
├── README.md            Spanish-language writeup (see template below)
├── README_EN.md         Optional English translation (only some projects have one)
├── workflows/*.json      Exported n8n workflow(s), credentials stripped
└── assets/*.png|jpg      Workflow canvas screenshots, example I/O, diagrams
```

The README itself generally follows: badges → table of contents → process
diagram → description/problem solved → architecture (ASCII diagram) →
prerequisites → installation → per-workflow node-by-node table → screenshots
gallery → repo structure → "Learnings clave" (key technical learnings) →
limitations/next steps → license → attribution footer. Not every project needs
every section — `Telegram-CSAT-ChatBOT/README.md` is the most complete
reference example.

### Recurring stylistic patterns

- **Language**: Spanish by default. Only write English if the user asks, or
  you're updating an existing `README_EN.md` companion file.
- **Emoji section headers** are used throughout (`## 🎯 Objetivo`, `## 📂
  Estructura`, etc.) — match the existing emoji vocabulary in a file rather
  than inventing a new style for it.
- **Attribution footer** on section READMEs, e.g.:
  `*Parte del repositorio [Process](../) · Germán — Industrial Engineer ·
  Digital Transformation · Process Automation*`. Keep/update this on files
  that already have it; don't add it to files that don't.
- **Tables** are used heavily for node-by-node workflow breakdowns, credential
  lists, and comparison matrices — prefer a Markdown table over prose when
  documenting workflow steps or options.

### Security — n8n / workflow exports

Exported `workflows/*.json` files **must not contain real credentials, API
keys, tokens, or webhook URLs**. n8n exports credentials by reference (ID +
type), not by value, but double-check any new export before committing —
especially `HTTP Request` nodes with hardcoded headers/auth, or `.url`/`.txt`
files that might contain a real link a contributor pasted in by hand.

### BPMN / RPA assets

`.bpmn` files are real XML (BPMN 2.0, often UiPath-flavored with a
`uipath:migrationVersion` extension) — they're meant to be re-opened in a BPMN
tool (UiPath Studio/Maestro, draw.io, Camunda Modeler), not hand-edited as
arbitrary text. When adding a new diagram, keep the exported `.png` alongside
the source file the way `BPMN/` and the `Telegram-CSAT-ChatBOT/assets/`
folders do (`*.drawio.png` + `*.drawio.xml` pairs).

### PDD / SDD documentation

`PDD-SDD/PDD/Plantillas_PDD.md` and `PDD-SDD/SDD/SDD_Plantilla.md` are the
canonical blank templates (numbered sections, emoji headers, fill-in tables).
When asked to draft a new PDD or SDD, copy the template structure rather than
freehanding a new layout — see the existing worked examples in each folder for
how a filled-in version reads.

## Known quirks (don't "fix" silently)

- Several files are plain text but **missing their extension** —
  `Digital-Transformation/Conceptos`, `Digital-Transformation/LINKS`,
  `Digital-Transformation/Procesos Operativos (core del negocio)`,
  `PDD-SDD/PDD/📘 PDD – Ejemplo Real (...)`,
  `PDD-SDD/SDD/Automatización del Proceso de Reclamos de Clientes`. They are
  readable text/Markdown despite the missing `.md`. Renaming them is fine if
  asked, but don't rename files as a drive-by while doing something else —
  ask first, since it changes every relative link pointing at them.
- `Digital-Transformation/README.MD` and `Digital-Transformation/ProcesosOperativos.md`
  are effectively empty (1 byte). Don't assume content is missing/lost — they
  appear to be untouched placeholders left from folder creation.
- The root `.BPMN` file (note the leading dot) is a stray empty file, not a
  config file for any tool — don't treat it as build configuration.
- File and folder names mix accents, spaces, and parentheses (e.g.
  `Telegram-CSAT-ChatBOT/assets/BPMN Process.drawio.png`). When referencing
  these paths in Markdown links, URL-encode spaces (`%20`) as the existing
  links already do.
- The `.github/workflows/npm-publish-github-packages.yml` action is a leftover
  default template — there is no `package.json`, so it cannot succeed. Don't
  use its presence/absence of runs as a signal of repo health, and don't
  "fix" it by adding a Node project unless explicitly asked.

## Git workflow

- Active development branch for AI-assisted work in this session:
  `claude/claude-md-docs-aetto4`.
- History shows most contributions arrive as direct GitHub web uploads
  ("Add files via upload") or single-file renames rather than local commits —
  don't be surprised by a flat history with few multi-file structured
  commits.
- This is a personal portfolio repo with one maintainer; there's no
  CONTRIBUTING.md, PR template, or required review process. Still follow the
  standard rule of only committing/pushing when explicitly asked.

## When making changes as an AI assistant

- Default to Spanish prose matching the surrounding file's tone (professional,
  first-person where the existing text already is, e.g. ROI and CLARA docs).
- Don't invent metrics, case studies, or URLs — the ROI case studies and
  `docs/references.md` are presented as real reference material; if asked to
  add a new one, mark estimates clearly or ask the user for real numbers/links.
- New automation case studies belong under
  `N8N-Automatizaciones/Automatizaciones/<ProjectName>/` following the
  project-folder pattern above; new learning exercises belong under
  `N8N-Automatizaciones/LABS/` instead.
- Don't add a build system, package manifest, or test framework — this repo
  intentionally has none.
