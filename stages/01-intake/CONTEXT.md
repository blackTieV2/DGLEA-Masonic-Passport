---
type: stage-contract
stage: 01-intake
version: 1.0
timestamp: "2026-06-29T13:05:11Z"
status: canonical
---

# Stage 01-intake

## Purpose

Collect, normalize, or reconstruct the project brief. Lock scope boundaries and success criteria.

## Inputs

| Layer | Source | File or Folder | Scope | Why Needed |
|---|---|---|---|---|
| 0 | workspace | `AGENTS.md` | full | Workspace rules |
| 1 | workspace | `CONTEXT.md` | full | Stage routing |
| 2 | stage | `stages/00-triage/output/triage-note.md` | full | Prior triage |
| 3 | durable | `_config/project-identity.md` | full | Project boundaries |
| 4 | reference | `stages/01-intake/references/` | as needed | User-supplied briefs |

## Process

1. Read the triage output and any supplied brief.
2. Normalize requirements into a clear project brief.
3. Define scope boundaries: in-scope, out-of-scope, deferred.
4. Define success criteria and acceptance criteria.
5. Capture unresolved questions and decisions needed from humans.
6. Write the intake outputs.

## Outputs

| Artifact | Location | Format | Required |
|---|---|---|---|
| Project brief | `stages/01-intake/output/project-brief.md` | Markdown + YAML | yes |
| Scope boundaries | `stages/01-intake/output/scope-boundaries.md` | Markdown | yes |
| Success criteria | `stages/01-intake/output/success-criteria.md` | Markdown | yes |
| Open questions | `stages/01-intake/output/open-questions.md` | Markdown | yes |

## Human review gate

The project brief, scope boundaries, and success criteria should be reviewed by the human before moving to research or design.

## Audit checks

- Are requirements traced to source documents or user statements?
- Are scope boundaries explicit?
- Are success criteria testable?

## Do Not

- Do not start designing or building in intake.
- Do not silently expand scope.
- Do not leave ambiguous requirements undocumented.
