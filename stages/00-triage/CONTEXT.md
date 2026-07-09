---
type: stage-contract
stage: 00-triage
version: 1.0
timestamp: "2026-06-29T13:05:11Z"
status: canonical
---

# Stage 00-triage

## Purpose

Determine what the user is asking for, whether this is a fresh project or takeover, and which stage should run next.

## Inputs

| Layer | Source | File or Folder | Scope | Why Needed |
|---|---|---|---|---|
| 0 | workspace | `AGENTS.md` | full | Understand workspace rules |
| 1 | workspace | `CONTEXT.md` | full | Understand stage routing |
| 4 | user | user request | full | The actual task or question |

## Process

1. Read `AGENTS.md` and `CONTEXT.md`.
2. Parse the user's request for intent, scope, and constraints.
3. Decide whether the project is in fresh-project mode or takeover mode.
4. Identify the most appropriate next stage.
5. List assumptions and unresolved questions.
6. Write the triage outputs.

## Outputs

| Artifact | Location | Format | Required |
|---|---|---|---|
| Triage note | `stages/00-triage/output/triage-note.md` | Markdown + YAML | yes |
| Assumptions | `stages/00-triage/output/assumptions.md` | Markdown | if any |
| Recommended next stage | `stages/00-triage/output/triage-note.md` | Markdown | yes |
| Unresolved questions | `stages/00-triage/output/triage-note.md` | Markdown | yes |

## Human review gate

Pause and ask the human if:

- The request is ambiguous and the next stage is unclear.
- The recommended action would be destructive.
- There are open questions that block the next stage.

## Audit checks

- Did the agent load only `AGENTS.md`, `CONTEXT.md`, and the user request?
- Is the recommended stage justified?
- Are assumptions and unresolved questions explicit?

## Do Not

- Do not implement anything in triage.
- Do not load the entire repository.
- Do not make destructive changes.
