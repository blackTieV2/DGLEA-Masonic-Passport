---
type: agent-entrypoint
version: 1.0
canonical: true
model_specific: false
applies_to:
  - all-agents
loading_order:
  - AGENTS.md
  - CONTEXT.md
  - stages/<selected-stage>/CONTEXT.md
rules:
  load_entire_repo_by_default: false
  preserve_existing_files: true
  ask_before_destructive_changes: true
  model_specific_files_are_adapters_only: true
project: DGLEA Masonic Passport
---

# Agent Entrypoint: DGLEA Masonic Passport Workspace

## What this workspace is

This repository contains the **DGLEA Masonic Passport**: a district-governed mentoring and progression platform for the District Grand Lodge of the Eastern Archipelago (DGLEA), intended for use across approximately 45 lodges.

It is a platform, not just a mobile app:

- Android mobile app (`apps/android`)
- Web admin portal (`apps/web-admin`)
- Modular-monolith backend (`backend`)
- Relational database and audit layer
- Notifications, reporting, and district analytics
- Model-neutral agent orchestration layer (this workspace)

The repository also holds formal product and architecture documentation in `docs/`.

## How agents should operate

1. **Read this file first**, then `CONTEXT.md`.
2. Identify the correct stage from `CONTEXT.md` for the task at hand.
3. Read **only** that stage's `CONTEXT.md` contract.
4. Load only the inputs listed in that contract.
5. Do **not** load the entire repository by default.
6. Preserve existing files. If a stage contract explicitly authorizes file changes, follow it; otherwise ask before destructive edits.
7. Prefer minimal, architecture-aligned changes.
8. Keep business rules in backend domain/application layers, not in UI or controllers.
9. Write outputs to the correct `stages/<stage>/output/` folder.
10. Update logs when you add durable knowledge or make meaningful decisions.

## Where durable knowledge lives

Durable project truth belongs in model-neutral Markdown files with YAML frontmatter:

- `_config/project-identity.md` — what the project is, scope, and boundaries
- `_config/operating-principles.md` — hard constraints, anti-patterns, change discipline
- `_config/coding-standards.md` — coding, persistence, API, and UI rules
- `_config/access-policy.md` — roles, permissions, and data access rules
- `_config/naming-conventions.md` — file, identifier, and artifact naming rules
- `_config/voice-rules.md` — language and tone expectations
- `shared/knowledge/okf/` — Open Knowledge Format concept files for domains, systems, datasets, playbooks, and references
- `docs/` — existing formal project documentation (PRD, SRS, architecture, API, UX, testing, operations)

If you discover knowledge that should outlive the current run, promote it into the appropriate durable file.

## Where transient work lives

- `stages/<stage>/output/` — artifacts for the current stage
- `runs/YYYY-MM-DD-topic-slug/` — grouped run artifacts when needed
- `archive/` — historical artifacts, including the original pre-workspace `AGENTS.md`

Do not bury transient drafts in durable knowledge files.

## How to choose a stage

Use `CONTEXT.md` as the router. Typical mappings:

| Task | Stage |
|---|---|
| "What should I do?" / ambiguous request | `00-triage` |
| Capture or normalize a brief | `01-intake` |
| Investigate, read docs, gather context | `02-research` |
| Architecture, plan, spec, workflow | `03-design` |
| Implement code, config, schema, UI | `04-build` |
| Test, review, validate, audit | `05-qa` |
| Wrap up and hand off | `06-handoff` |

If the stage is not obvious, default to `00-triage`.

## How to load context

Load context in layers. Stop when you have enough to do the current task.

| Layer | Source | Purpose |
|---|---|---|
| 0 | `AGENTS.md` | Workspace identity and universal rules |
| 1 | `CONTEXT.md` | Task routing and stage selection |
| 2 | `stages/<stage>/CONTEXT.md` | Stage contract: inputs, process, outputs, review gate |
| 3 | `_config/` and `shared/knowledge/okf/` | Stable reference material |
| 4 | `stages/<stage>/output/` and `references/` | Working artifacts for the current run |

## How to write outputs

- Use Markdown with YAML frontmatter for durable knowledge and stage reports.
- Use Markdown tables for structured comparisons, mappings, and decisions.
- Use JSON or YAML only for strict machine-readable artifacts: schemas, inventories, manifests, validation reports.
- Use predictable artifact names: `[topic-slug]-[artifact-type].md`.
- Lowercase-with-hyphens for all file and folder names.
- No spaces in file or folder names.

## Human review gates

- Major architectural, destructive, or creative decisions require explicit human approval before proceeding.
- Each stage contract declares its human review gate.
- Surface assumptions clearly when requirements are ambiguous.
- If you find contradictions between documents, list them and propose the smallest viable resolution.

## How to handle existing files

- Read existing files before editing.
- Do not delete, overwrite, rename, or move existing source files or formal docs without human approval.
- If you must repurpose an instruction file (like `AGENTS.md` or `README.md`), first archive or migrate its prior project truth.
- Keep the workspace Git-friendly: prefer plain text, predictable names, and small focused changes.

## How to handle secrets

- Never place secrets in Markdown, JSON, or committed files.
- Use `.env.example` for documented environment variable placeholders.
- Store real secrets in environment variables, a secret manager, or documented external configuration.
- If you discover committed secrets, flag them immediately and recommend rotation.

## How to update logs

- Add meaningful durable-knowledge changes to `shared/knowledge/okf/log.md`.
- Add run-level notes to the current stage's `output/` folder.
- Update `workspace.manifest.yaml` if the workspace structure itself changes.

## How to preserve model neutrality

- Do not put unique project truth in model-specific adapter files.
- Adapter files in `model-adapters/` exist only to help particular tools enter the workspace. Each one points back to `AGENTS.md`, `CONTEXT.md`, and the relevant stage contract.
- If a tool-specific file conflicts with the canonical files, the canonical files win.

## Final Instruction

If forced to choose, always prefer:

> **clarity, correctness, auditability, and maintainability over speed, cleverness, and speculative complexity**
