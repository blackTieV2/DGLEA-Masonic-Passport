---
type: research-memo
title: Model-neutral workspace takeover discovery
version: 1.0
timestamp: "2026-07-01"
status: approved
sensitivity: internal
---

# Model-neutral Workspace Takeover Discovery

## Executive Summary

This is takeover mode. A substantial model-neutral workspace overlay already exists and satisfies most requested acceptance criteria. `AGENTS.md` is canonical, `CONTEXT.md` routes tasks, all seven stage contracts and manifests exist, adapters are thin, and the OKF concept files pass the required frontmatter audit.

Normalization should not proceed yet. The Git working tree contains a large pre-existing backend replacement: tracked legacy backend files are deleted while NestJS/Prisma replacements are untracked. The workspace overlay is also mostly untracked. These changes appear intentional and are recorded in the OKF log, but their ownership and desired commit boundary must be confirmed before further changes.

## Inventory Summary

| Area | Files found | Assessment |
|---|---:|---|
| `_config/` | 6 | Complete requested configuration set |
| `model-adapters/` | 7 | Index plus six thin adapters; no unique project truth found |
| `stages/` | 33 | Seven contracts, seven manifests, reference/output folders, and artifacts |
| `shared/knowledge/okf/` | 18 | Indexes, log, and nine concept files |
| `shared/tooling/` | 0 | Missing requested tooling bundle |
| `setup/` | 2 | Questionnaire and onboarding notes present |
| `archive/` | 164 | Preserved original instructions and legacy backend; content not broadly loaded |
| Application/docs | 185 | Filenames inventoried only; source content not loaded |

## Instruction and Model-neutrality Findings

- `AGENTS.md` declares itself canonical and defines layered loading, preservation, security, output, and model-neutrality rules.
- `CONTEXT.md` clearly routes the supported task types and warns against loading source/docs/archive wholesale.
- The prior project-specific `AGENTS.md` is preserved at `archive/original-agents.md`; sampled project truth is represented in `_config/` and OKF files.
- No root-level `CLAUDE.md`, `GEMINI.md`, `CODEX.md`, `GPT.md`, Copilot, Cursor, or Windsurf instruction file was found.
- The six files under `model-adapters/` are thin pointers to the canonical instructions and contain no unique project truth.
- All stage contracts contain Purpose, Inputs, Process, Outputs, Human Review Gate, Audit Checks, and Do Not sections.

## Durable and Transient Knowledge Findings

- Durable project facts and rules are separated into `_config/` and `shared/knowledge/okf/`.
- All nine non-index OKF concept files include the required `type`, `title`, `description`, `tags`, `timestamp`, `status`, and `sensitivity` fields.
- Stage outputs and run artifacts are separated from durable knowledge.
- The OKF log records both workspace creation and the later NestJS/Prisma backend foundation.

## Security Findings

Filename-based inspection found no committed credential or private-key files. `backend/.env.example` is appropriate documentation. Matches for `simple-token-provider.ts` and secret-policy documentation are descriptive, not evidence of exposed secrets. File contents were not scanned for high-entropy credentials, so this is not a complete secret scan.

## Conflicts and Gaps

1. The requested `shared/tooling/` files are absent: `tool-prereqs.md`, `connectors.md`, `commands.md`, and `environment.md`.
2. `setup/onboarding-notes.md` points to the triage note for open decisions, but the current triage note has no blocking questions; any unresolved product decisions should have a current canonical location.
3. `apps/web-admin/README.md` exists, but its `package.json` is empty; the portal is a placeholder rather than a runnable scaffold.
4. The naming policy requires lowercase-with-hyphens, while pre-existing formal documentation uses uppercase and underscores. Renaming those files would be destructive and link-sensitive; no rename is recommended without a separate approved migration.
5. The existing workspace and backend migration are not committed. This makes attribution, rollback, and safe normalization materially harder.

## Migration / Repair Map

| Current state | Proposed state | Action | Risk | Rollback |
|---|---|---|---|---|
| `shared/tooling/` absent | Four requested Markdown files plus folder index if useful | Create after approval; document actual prerequisites, connectors, commands, and environment | Low, but facts must match the active backend | Remove only newly created files |
| Stale onboarding open-decision pointer | Pointer to a current decision artifact or explicit “none” | Amend after confirming canonical decision location | Low | Revert single Markdown edit |
| Minimal `apps/web-admin/README.md` and empty package file | README accurately labels the portal as a placeholder | Amend from verified facts without selecting a framework | Low | Revert documentation-only change |
| Uncommitted workspace overlay | Reviewable commit isolated from backend migration where practical | Human chooses commit boundary | Medium | Git revert of the approved commit |
| Legacy backend deleted and new backend untracked | Intentional migration committed with preserved archive | Treat as separate existing work; validate in build/QA stages | High | Restore only through an approved migration plan; legacy copy exists under `archive/` |
| Mixed-case legacy docs | Preserve current paths | Record as grandfathered naming exception | Low | No filesystem change |

## Proposed Tree Delta

```text
shared/
  tooling/
    commands.md
    connectors.md
    environment.md
    tool-prereqs.md
```

No moves, renames, or deletions are proposed.

## Human Review Gate

Satisfied on 2026-07-01. The user approved preserving the backend/workspace changes and applying the non-destructive repair map.
