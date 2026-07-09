---
type: stage-contract
stage: 03-design
version: 1.0
timestamp: "2026-06-29T13:05:11Z"
status: canonical
---

# Stage 03-design

## Purpose

Convert research and requirements into a clear plan, architecture, specification, or workflow.

## Inputs

| Layer | Source | File or Folder | Scope | Why Needed |
|---|---|---|---|---|
| 0 | workspace | `AGENTS.md` | full | Workspace rules |
| 1 | workspace | `CONTEXT.md` | full | Stage routing |
| 2 | stage | `stages/02-research/output/research-memo.md` | full | Research findings |
| 3 | durable | `_config/operating-principles.md` | full | Constraints |
| 3 | durable | `_config/access-policy.md` | full | Permissions |
| 3 | durable | `shared/knowledge/okf/domains/` | scoped | Domain concepts |
| 3 | durable | `shared/knowledge/okf/systems/` | scoped | System architecture |

## Process

1. Read the research memo and relevant durable knowledge.
2. Design the solution within project constraints.
3. Produce a design specification with diagrams or tables as needed.
4. Produce an implementation plan with priorities and dependencies.
5. Define acceptance criteria.
6. Write the design outputs.

## Outputs

| Artifact | Location | Format | Required |
|---|---|---|---|
| Design spec | `stages/03-design/output/design-spec.md` | Markdown + YAML | yes |
| Implementation plan | `stages/03-design/output/implementation-plan.md` | Markdown | yes |
| Acceptance criteria | `stages/03-design/output/acceptance-criteria.md` | Markdown | yes |
| Risks and constraints | `stages/03-design/output/risks-and-constraints.md` | Markdown | yes |

## Human review gate

Design specifications, architecture choices, and implementation plans require human approval before build.

## Audit checks

- Does the design respect hard constraints in `_config/operating-principles.md`?
- Are permissions and workflow explicit?
- Are acceptance criteria testable?
- Are risks listed?

## Do Not

- Do not start coding before design is approved.
- Do not introduce speculative complexity.
- Do not blur states or roles.
