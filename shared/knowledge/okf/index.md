---
type: okf-index
title: Open Knowledge Format Index
version: 1.0
timestamp: "2026-06-29T13:05:11Z"
status: canonical
sensitivity: internal
---

# Open Knowledge Format Index

This folder holds durable, reusable project knowledge in OKF-style Markdown with YAML frontmatter.

## Folder guide

| Folder | Purpose |
|---|---|
| `domains/` | Domain concepts: roles, workflow states, passport sections, progress lifecycle. |
| `systems/` | System architecture: backend modules, data model overview, API conventions. |
| `datasets/` | Seed data references, template mappings, glossary, terminology. |
| `playbooks/` | Recurring procedures: testing expectations, build order, release gates. |
| `references/` | External and internal source documents, citations, source notes. |

## Adding knowledge

- Use Markdown with YAML frontmatter.
- Minimum frontmatter: `type`, `title`, `description`, `tags`, `timestamp`, `status`, `sensitivity`.
- Use citations for externally sourced factual claims.
- Promote knowledge from transient stage outputs when it becomes reusable.

## Log

See `log.md` for a chronological record of meaningful updates.
