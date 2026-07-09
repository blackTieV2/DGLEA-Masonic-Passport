---
type: stage-contract
stage: 05-qa
version: 1.0
timestamp: "2026-06-29T13:05:11Z"
status: canonical
---

# Stage 05-qa

## Purpose

Check the output against requirements, stage contracts, naming rules, OKF rules, citations, security rules, and handoff needs.

## Inputs

| Layer | Source | File or Folder | Scope | Why Needed |
|---|---|---|---|---|
| 0 | workspace | `AGENTS.md` | full | Workspace rules |
| 1 | workspace | `CONTEXT.md` | full | Stage routing |
| 2 | stage | `stages/03-design/output/acceptance-criteria.md` | full | Criteria |
| 2 | stage | `stages/04-build/output/` | full | Build outputs |
| 3 | durable | `_config/naming-conventions.md` | full | Naming rules |
| 3 | durable | `_config/access-policy.md` | full | Permission rules |
| 3 | durable | `shared/knowledge/okf/` | scoped | Knowledge rules |

## Process

1. Read the acceptance criteria and build outputs.
2. Verify functional correctness, permissions, workflow transitions, and audit.
3. Check naming conventions and file locations.
4. Check that durable knowledge is promoted where appropriate.
5. Record defects, remediation actions, and an acceptance decision.
6. Write the QA outputs.

## Outputs

| Artifact | Location | Format | Required |
|---|---|---|---|
| QA report | `stages/05-qa/output/qa-report.md` | Markdown + YAML | yes |
| Defects | `stages/05-qa/output/defects.md` | Markdown | yes |
| Remediation actions | `stages/05-qa/output/remediation-actions.md` | Markdown | yes |
| Acceptance decision | `stages/05-qa/output/acceptance-decision.md` | Markdown | yes |

## Human review gate

A reject or conditional-accept decision must be reviewed by the human. Critical security or privacy defects must be fixed before handoff.

## Audit checks

- Are defects traced to acceptance criteria?
- Are permission and privacy checks included?
- Are naming and OKF rules followed?
- Is the acceptance decision explicit?

## Do Not

- Do not accept work with unresolved critical defects.
- Do not skip cross-scope access checks.
- Do not ignore naming or documentation drift.
