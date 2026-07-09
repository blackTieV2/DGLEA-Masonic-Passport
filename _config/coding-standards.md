---
type: config
title: Coding Standards
version: 1.0
timestamp: "2026-06-29T13:05:11Z"
status: canonical
sensitivity: internal
---

# Coding Standards

## General

- Prefer explicit names over clever names.
- Keep code production-minded.
- Keep code typed where the language supports it.
- Keep files and modules small enough to be understood.
- Write code that is easy to test.
- Avoid unnecessary abstraction.
- Avoid speculative infrastructure.

## Business logic

- Put business rules in domain/application layers.
- Do not put important workflow logic primarily in controllers.
- Do not put important workflow logic primarily in UI code.
- Make state transitions explicit.
- Make permission decisions explicit.
- Make audit events explicit.

## Persistence

- Preserve historical truth.
- Avoid destructive updates to verified data.
- Keep audit trails first-class.
- Keep district core vs lodge supplement distinction explicit in the schema.
- Keep private mentoring notes separate from normal workflow records.

## API

- Keep APIs explicit and domain-oriented.
- Prefer workflow endpoints over vague generic update behaviour.
- Enforce permissions server-side.
- Use consistent error shapes.
- Keep naming aligned with the OpenAPI contract and glossary.

## UI

- Android is task-focused.
- Web admin is administration- and oversight-focused.
- Do not let the UI become the source of truth.
- Do not expose irrelevant actions to roles that cannot use them.

## Testing

Bias toward:

- unit tests for business rules
- integration tests for workflow and persistence
- a smaller set of meaningful end-to-end tests

Highest-priority test areas:

1. permissions and scope
2. verification workflow state transitions
3. audit generation
4. district/lodge boundary enforcement
5. reporting and analytics correctness
6. feature-flag targeting

When implementing a new feature, add or update tests for:

- allowed behaviour
- denied behaviour
- invalid workflow state transitions
- cross-scope access attempts
- audit implications where relevant

## Frontend conventions

- Android: Kotlin with Jetpack Compose recommended for new production work.
- Architecture: MVVM or unidirectional state flow (ViewModel -> UI state -> Composables).
- Networking: Retrofit or Ktor client with auth interceptor, retry policy, typed DTOs.
- Local storage: Room plus DataStore; wipe sensitive cache on sign-out where required.
- Dependency injection: Hilt or Koin; use one convention throughout.
