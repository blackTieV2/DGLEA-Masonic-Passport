---
type: workspace-router
version: 1.0
canonical: true
applies_to:
  - all-agents
---

# Workspace Router

This file routes tasks to the correct stage and tells agents what to load first.

## What this project is

The **DGLEA Masonic Passport** is a district-governed mentoring and progression platform for the District Grand Lodge of the Eastern Archipelago (DGLEA), serving approximately 45 lodges.

Current implementation state:

- `apps/android` — existing Android proof-of-flow (sign-in, draft, submit, mentor review, clarification, sign-out/account switching)
- `backend` — Node-based modular-monolith skeleton with migrations, seeds, and tests
- `apps/web-admin` — initial scaffold
- `shared/contracts` — shared contracts and fixtures
- `docs/` — formal product, architecture, API, UX, testing, and operations documentation

The immediate goal is to move from the proven Brother/Mentor workflow to the complete role-gated Passport product.

## Task-to-stage routing

| Task type | Stage | Why |
|---|---|---|
| Ambiguous request, "what should I do?", or needs clarification before work | `00-triage` | Determine mode, scope, and next step. |
| Capture brief, normalize requirements, confirm scope | `01-intake` | Produce the active project brief. |
| Read docs, investigate codebase, gather sources | `02-research` | Produce a research memo and source list. |
| Plan architecture, design workflow, write spec | `03-design` | Produce a design spec and implementation plan. |
| Write code, schema, config, UI, tests | `04-build` | Produce implementation artifacts and validation notes. |
| Validate, review, audit, security/privacy checks | `05-qa` | Produce QA report and remediation list. |
| Wrap up, summarize, hand off | `06-handoff` | Produce handoff note and next actions. |

## What to read first

1. `AGENTS.md` — workspace identity and universal rules
2. This file (`CONTEXT.md`)
3. The `CONTEXT.md` of the selected stage

## What each stage produces

| Stage | Primary output | Location |
|---|---|---|
| `00-triage` | Triage note, assumptions, recommended next stage, open questions | `stages/00-triage/output/` |
| `01-intake` | Normalized project brief, scope boundaries, success criteria | `stages/01-intake/output/` |
| `02-research` | Research memo, source list, reusable knowledge candidates | `stages/02-research/output/` |
| `03-design` | Design spec, implementation plan, acceptance criteria | `stages/03-design/output/` |
| `04-build` | Implementation artifacts, changed-files list, build/test notes | `stages/04-build/output/` |
| `05-qa` | QA report, defects, remediation actions, acceptance decision | `stages/05-qa/output/` |
| `06-handoff` | Handoff note, changed-files summary, next actions, known issues | `stages/06-handoff/output/` |

## What not to load by default

- Do not load the entire `docs/` folder unless the stage contract says so.
- Do not load full source trees (`apps/`, `backend/src/`) unless the task requires implementation.
- Do not load old `archive/` content unless investigating history.
- Do not load `model-adapters/` as canonical truth.

## How to escalate ambiguity

If any of the following are unclear:

- Which stage to run
- Whether a decision requires human approval
- Contradictions between source documents
- Missing acceptance criteria

Stop and surface the ambiguity in the current stage output. Ask the human for direction before proceeding.

## Durable knowledge quick reference

| Topic | File |
|---|---|
| Project identity and boundaries | `_config/project-identity.md` |
| Hard constraints and anti-patterns | `_config/operating-principles.md` |
| Roles and permissions | `_config/access-policy.md`, `shared/knowledge/okf/domains/roles.md` |
| Workflow states | `shared/knowledge/okf/domains/workflow-states.md` |
| Passport sections | `shared/knowledge/okf/domains/passport-sections.md` |
| Backend modules | `shared/knowledge/okf/systems/backend-modules.md` |
| Coding standards | `_config/coding-standards.md` |
| Naming conventions | `_config/naming-conventions.md` |
| Voice and tone | `_config/voice-rules.md` |
