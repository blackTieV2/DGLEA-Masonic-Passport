# Contributing

## Branching
- Keep changes small and reviewable
- Prefer focused pull requests
- Do not mix unrelated changes in one PR

## Before opening a PR
- Run backend tests
- Run lint and typecheck
- For Android, use the Gradle wrapper
- Do not commit generated build artifacts

## Architecture rules
- Follow `AGENTS.md`
- Keep backend modular-monolith structure intact
- Do not introduce microservices or micro frontends
- Keep business rules out of UI layers