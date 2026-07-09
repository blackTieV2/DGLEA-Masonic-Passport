---
type: migration-map
title: Model-Neutral Workspace Overlay Migration Map
version: 1.0
timestamp: "2026-06-29T13:05:11Z"
status: complete
---

# Migration Map

## Files That Stay Unchanged

| Path | Reason |
|---|---|
| `apps/` | Existing Android and web-admin code remains in place. |
| `backend/` | Existing backend skeleton remains in place. |
| `docs/` | Existing project documentation remains authoritative until superseded by durable knowledge files. |
| `shared/contracts/` | Existing shared contracts remain. |
| `infra/` | Existing infrastructure docs remain. |
| `scripts/` | Existing scripts remain. |
| `.github/` | Existing CI workflows and templates remain. |
| `LICENSE`, `CODEOWNERS`, `CONTRIBUTING.md`, `.editorconfig`, `.gitattributes`, `.gitignore` | Existing project metadata remains. |

## Files Being Rewritten / Repurposed

| Original | New Purpose | Notes |
|---|---|---|
| `AGENTS.md` | Canonical model-neutral agent entrypoint | Project truth moved to `_config/` and `shared/knowledge/okf/`. Original archived at `archive/original-agents.md`. |
| `README.md` | Human-facing workspace and project guide | Adds workspace usage instructions on top of existing project overview. |

## New Files and Directories

| Path | Purpose |
|---|---|
| `CONTEXT.md` | Workspace router: task types -> stages. |
| `workspace.manifest.yaml` | Machine-readable workspace inventory. |
| `setup/questionnaire.md` | Onboarding questionnaire for new humans/agents. |
| `setup/onboarding-notes.md` | Workspace onboarding notes. |
| `_config/project-identity.md` | Durable project identity and boundaries. |
| `_config/operating-principles.md` | Hard constraints, anti-patterns, change discipline. |
| `_config/voice-rules.md` | Language and tone rules. |
| `_config/coding-standards.md` | Coding, persistence, API, UI rules. |
| `_config/access-policy.md` | Roles, permissions, and data access rules. |
| `_config/naming-conventions.md` | Naming rules for files, identifiers, artifacts. |
| `model-adapters/` | Thin adapters for common LLM/IDE tools. |
| `shared/tooling/` | Tool prerequisites, connectors, commands, environment notes. |
| `shared/knowledge/okf/` | Durable knowledge in OKF-style Markdown. |
| `skills/` | Reusable skill registry. |
| `stages/00-triage/` to `stages/06-handoff/` | Stage contracts and outputs. |
| `runs/` | Per-run working folders. |
| `archive/` | Historical artifacts, including original `AGENTS.md`. |

## Knowledge Migration

| Source (old `AGENTS.md` section) | Destination |
|---|---|
| Project Identity | `_config/project-identity.md` |
| Hard Architectural Constraints | `_config/operating-principles.md` |
| Domain Truths | `shared/knowledge/okf/domains/passport-sections.md`, `shared/knowledge/okf/domains/domain-truths.md` |
| Core Roles | `_config/access-policy.md`, `shared/knowledge/okf/domains/roles.md` |
| Core Workflow States | `shared/knowledge/okf/domains/workflow-states.md` |
| Backend Module Structure | `shared/knowledge/okf/systems/backend-modules.md` |
| Coding Rules | `_config/coding-standards.md` |
| Testing Expectations | `shared/knowledge/okf/playbooks/testing-expectations.md` |
| Feature Flags | `_config/operating-principles.md` |
| Preferred Build Order | `shared/knowledge/okf/playbooks/build-order.md` |

## Rollback Notes

- The original `AGENTS.md` content is preserved in `archive/original-agents.md`.
- The original `README.md` content is preserved in the project docs and can be restored from Git history if needed.
- The new workspace overlay does not modify source code, so code builds remain unaffected.
