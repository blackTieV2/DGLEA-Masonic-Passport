---
type: stage-contract
stage: 06-handoff
version: 1.0
timestamp: "2026-06-29T13:05:11Z"
status: canonical
---

# Stage 06-handoff

## Purpose

Prepare the project for the next human or agent.

## Inputs

| Layer | Source | File or Folder | Scope | Why Needed |
|---|---|---|---|---|
| 0 | workspace | `AGENTS.md` | full | Workspace rules |
| 1 | workspace | `CONTEXT.md` | full | Stage routing |
| 2 | stage | `stages/04-build/output/` | full | Build outputs |
| 2 | stage | `stages/05-qa/output/` | full | QA outputs |
| 3 | durable | `shared/knowledge/okf/log.md` | full | Knowledge log |

## Process

1. Gather outputs from the previous stages.
2. Summarize what changed and why.
3. List next actions and known issues.
4. Promote durable knowledge discovered during the run.
5. Update `shared/knowledge/okf/log.md`.
6. Write the handoff outputs.

## Outputs

| Artifact | Location | Format | Required |
|---|---|---|---|
| Handoff note | `stages/06-handoff/output/handoff-note.md` | Markdown + YAML | yes |
| Changed files summary | `stages/06-handoff/output/changed-files-summary.md` | Markdown | yes |
| Next actions | `stages/06-handoff/output/next-actions.md` | Markdown | yes |
| Known issues | `stages/06-handoff/output/known-issues.md` | Markdown | yes |

## Human review gate

The handoff note should be surfaced to the human before the next run begins, especially if there are unresolved issues or open decisions.

## Audit checks

- Are all changed files listed?
- Are next actions clear and actionable?
- Are known issues honest and specific?
- Is durable knowledge promoted and logged?

## Do Not

- Do not hide known issues or open questions.
- Do not leave transient outputs scattered outside stage folders.
