---
type: known-issues
title: Known Issues
version: 1.0
timestamp: "2026-06-29T13:05:11Z"
status: open
sensitivity: internal
---

# Known Issues

1. **Missing `.env.example`** — the workspace overlay does not include runtime configuration placeholders. Create once backend framework and identity provider are selected.
2. **Unselected backend framework** — NestJS/Node.js vs Kotlin/Spring Boot is unresolved.
3. **Unselected identity provider** — local auth, OIDC, or magic link is unresolved.
4. **Mock-only Android code** — existing `apps/android` may contain mock data/screens that need to be marked or removed when connecting to the backend.
5. **Open decisions** — see `stages/01-intake/output/open-questions.md` for the full list.
