# DGLEA Masonic Passport — API Style Guide

**Document Status:** Draft v1  
**Project:** DGLEA Masonic Passport  
**Date:** 2026-04-06

---

## 1. Source of Truth

Canonical naming for roles, entities, states, modules, and enums is defined in:

- `docs/00-overview/project-glossary.md`

This file complements the glossary with API-specific style rules.

---

## 2. Path and Resource Rules

1. Base path: `/api/v1`
2. Resource names: plural kebab-case nouns.
3. Use hierarchical paths for containment where scope is clear.
4. Use action sub-resources only for explicit workflow transitions.

---

## 3. Payload Rules

1. JSON fields: `camelCase`.
2. Enums: `UPPER_SNAKE_CASE`.
3. Use explicit status and reason fields for workflow transitions.
4. Include actor and timestamp fields for auditable actions.

---

## 4. Error Rules

1. Return structured error bodies with machine-readable codes.
2. Keep permission errors distinct from validation errors.
3. Include correlation/request IDs where available.

---

## 5. Documentation Rules

1. Endpoint names in docs must match contract outline exactly.
2. Examples must use canonical role/state enums.
3. Avoid mixed alias naming (e.g., “Lodge Reviewer”).
