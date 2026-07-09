---
type: config
title: Naming Conventions
version: 1.0
timestamp: "2026-06-29T13:05:11Z"
status: canonical
sensitivity: internal
---

# Naming Conventions

## Files and folders

- Use **lowercase-with-hyphens** for all file and folder names.
- Use **zero-padded numbers** for stage folders: `00-triage`, `01-intake`, etc.
- Avoid spaces in file and folder names.
- Use predictable artifact names: `[topic-slug]-[artifact-type].md`.

Examples:

- `stages/01-intake/output/project-brief.md`
- `stages/03-design/output/design-spec.md`
- `shared/knowledge/okf/domains/workflow-states.md`

## Identifiers

- Use explicit names over clever abbreviations.
- Enum values: `SCREAMING_SNAKE_CASE` (e.g., `ENTERED_APPRENTICE`, `CLARIFICATION_REQUESTED`).
- Roles: canonical names in `SCREAMING_SNAKE_CASE`.
- Database tables/columns: lowercase snake_case.
- Code identifiers: follow the language's dominant convention (Kotlin camelCase, TypeScript camelCase, etc.).

## Placeholders

- Use `{{SCREAMING_SNAKE_CASE}}` only for placeholders in templates or manifests.

## Canonical names

Do not rename the following once implementation begins without explicit approval:

- Roles: `BROTHER`, `PERSONAL_MENTOR`, `LODGE_MENTOR`, `LODGE_REVIEWER`, `LODGE_ADMIN`, `DISTRICT_MENTOR`, `DISTRICT_ADMIN`, `SYSTEM_ADMIN`
- Workflow states: `DRAFT`, `SUBMITTED`, `NEEDS_CLARIFICATION`, `VERIFIED`, `REJECTED`, `OVERRIDDEN`, `SUPERSEDED`, `ARCHIVED`
- Passport sections: `ENTERED_APPRENTICE`, `FELLOW_CRAFT`, `MASTER_MASON`, `PREPARING_FOR_OFFICE`

## No duplicate canonical homes

Never create multiple canonical homes for the same rule, policy, schema, or fact. If the same fact appears in two places, one must clearly reference the other.
