---
type: stage-contract
stage: 04-build
version: 1.0
timestamp: "2026-06-29T13:05:11Z"
status: canonical
---

# Stage 04-build

## Purpose

Create or modify the actual deliverable: code, configuration, schema, UI, or project asset.

## Inputs

| Layer | Source | File or Folder | Scope | Why Needed |
|---|---|---|---|---|
| 0 | workspace | `AGENTS.md` | full | Workspace rules |
| 1 | workspace | `CONTEXT.md` | full | Stage routing |
| 2 | stage | `stages/03-design/output/design-spec.md` | full | Design spec |
| 2 | stage | `stages/03-design/output/implementation-plan.md` | full | Build order |
| 3 | durable | `_config/coding-standards.md` | full | Coding rules |
| 3 | durable | `shared/knowledge/okf/` | scoped | Domain and system knowledge |
| 4 | code | `apps/`, `backend/`, `shared/` | scoped | Implementation target |

## Process

1. Read the design spec and implementation plan.
2. Make minimal, architecture-aligned changes.
3. Add or update tests for allowed, denied, and invalid cases.
4. Run relevant build and test commands.
5. Record changed files and build notes.
6. Write the build outputs.

## Outputs

| Artifact | Location | Format | Required |
|---|---|---|---|
| Changed files list | `stages/04-build/output/changed-files.md` | Markdown | yes |
| Build notes | `stages/04-build/output/build-notes.md` | Markdown | yes |
| Test results summary | `stages/04-build/output/test-results.md` | Markdown | yes |
| Implementation artifacts | source tree | code/config | yes |

## Human review gate

Pause for human review before merging or before changes that affect architecture, security, privacy, or public APIs.

## Audit checks

- Are changes minimal and aligned with the design spec?
- Are permissions enforced server-side?
- Are audit events generated where required?
- Do tests cover allowed, denied, and invalid transitions?

## Do Not

- Do not put business rules in controllers or UI.
- Do not store ritual secrets.
- Do not skip tests for permission or workflow changes.
