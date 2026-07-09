---
type: stage-contract
stage: 02-research
version: 1.0
timestamp: "2026-06-29T13:05:11Z"
status: canonical
---

# Stage 02-research

## Purpose

Gather, verify, and structure the context needed for the current project or run.

## Inputs

| Layer | Source | File or Folder | Scope | Why Needed |
|---|---|---|---|---|
| 0 | workspace | `AGENTS.md` | full | Workspace rules |
| 1 | workspace | `CONTEXT.md` | full | Stage routing |
| 2 | stage | `stages/01-intake/output/project-brief.md` | full | Active brief |
| 3 | durable | `_config/` and `shared/knowledge/okf/` | scoped | Existing knowledge |
| 3 | docs | `docs/` relevant files | scoped | Source documents |
| 4 | code | `apps/`, `backend/`, `shared/` | scoped | Implementation context |

## Process

1. Read the active brief.
2. Identify the documents and code areas that answer the brief's questions.
3. Read selectively; do not load the entire repo.
4. Summarize findings, cite sources, and note conflicts.
5. Identify reusable knowledge candidates and open questions.
6. Write the research outputs.

## Outputs

| Artifact | Location | Format | Required |
|---|---|---|---|
| Research memo | `stages/02-research/output/research-memo.md` | Markdown + YAML | yes |
| Source list | `stages/02-research/output/source-list.md` | Markdown | yes |
| Knowledge candidates | `stages/02-research/output/knowledge-candidates.md` | Markdown | yes |
| Open questions | `stages/02-research/output/open-questions.md` | Markdown | if any |

## Human review gate

Pause if research reveals contradictions, missing sources, or questions that change scope. Surface these before design.

## Audit checks

- Did the agent load only relevant files?
- Are factual claims cited?
- Are conflicts listed?
- Are durable knowledge candidates identified?

## Do Not

- Do not implement during research.
- Do not load the whole repository by default.
- Do not bury findings in transient notes without promotion.
