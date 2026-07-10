# DGLEA Masonic Passport

A district-governed mentoring and progression platform for the District Grand Lodge of the Eastern Archipelago (DGLEA).

## Project purpose

The DGLEA Masonic Passport digitises the district passport and mentoring workflow across approximately 45 lodges. It tracks mentoring progress, dates, visits, rituals performed, reviews, and readiness indicators — without storing restricted ritual wording, signs, grips, passwords, or detailed ritual answers.

This is **not** just an Android app. It is a platform with:

- Android mobile app for Brothers and mentors (`apps/android`)
- Web admin portal for lodge and district oversight (`apps/web-admin`)
- Modular-monolith backend (`backend`)
- Relational system-of-record database
- Notification, reporting, and district analytics capability
- Audit and governance controls

## Repository structure

```text
docs/           Product, architecture, API, UX, testing, and ops documentation
apps/           Android app and web admin portal
backend/        Modular-monolith backend
shared/         Stable shared contracts, enums, validation, fixtures
infra/          Local/staging/prod infrastructure and scripts
scripts/        Setup, CI, dev, release helper scripts
stages/         Agent workspace stage contracts and outputs
_config/        Canonical project configuration and principles
shared/knowledge/okf/   Durable knowledge in Open Knowledge Format
model-adapters/ Tool-specific entrypoint adapters for LLMs/IDEs
```

## Workspace usage

This repository now includes a **model-neutral agent workspace**.

- `AGENTS.md` is the canonical entrypoint for any agent.
- `CONTEXT.md` routes tasks to the correct stage.
- `stages/<stage>/CONTEXT.md` defines each stage's contract.
- `_config/` and `shared/knowledge/okf/` hold durable project knowledge.

If you are a human developer, start with the existing docs in `docs/` and the app-specific READMEs in `apps/android/README.md`, `apps/web-admin/README.md`, and `backend/README.md`.

If you are an agent, read `AGENTS.md`, then `CONTEXT.md`, then the contract for the stage you are running.

## Key documentation

### Product

- `docs/01-product/DGLEA_Masonic_Passport_PRD_v2_1.md`
- `docs/01-product/DGLEA_Masonic_Passport_SRS_v2_1.md`
- `docs/01-product/DGLEA_Masonic_Passport_MVP_Backlog_Epics_User_Stories_Acceptance_Criteria_v1.md`

### Architecture

- `docs/02-architecture/DGLEA_Masonic_Passport_Technical_Architecture_ADR_v1.md`
- `docs/02-architecture/DGLEA_Masonic_Passport_System_Context_and_Container_Diagrams_v1.md`
- `docs/02-architecture/DGLEA_Masonic_Passport_Domain_Model_ERD_v1.md`
- `docs/02-architecture/DGLEA_Masonic_Passport_Permissions_Matrix_v1.md`
- `docs/02-architecture/DGLEA_Masonic_Passport_Verification_Workflow_State_Diagram_v1.md`

### API

- `docs/03-api/DGLEA_Masonic_Passport_OpenAPI_Contract_Outline_v1.md`

### UX

- `docs/04-ux/DGLEA_Masonic_Passport_Screen_Map_and_Navigation_v1.md`

### Testing

- `docs/05-testing/DGLEA_Masonic_Passport_Test_Strategy_v1.md`

## Engineering principles

- Prefer explicit names over clever names.
- Build vertical slices, not disconnected layers.
- Put business rules in domain/application logic, not controllers or UI.
- Preserve historical truth; do not destructively overwrite verified data.
- Enforce permissions and scope server-side.
- Treat verification as an explicit governed workflow.
- Start simple and production-minded; avoid speculative complexity.

## Current phase

Backend foundation, Android Brother thin slice, API/runtime alignment, and local developer setup hardening.

See `repo-roadmap.md` for the high-level roadmap and `stages/00-triage/output/` for the latest takeover notes.

## How to hand off

1. Ensure the latest run artifacts are in the correct `stages/<stage>/output/` folder.
2. Update `shared/knowledge/okf/log.md` with durable decisions.
3. Commit the workspace overlay and stage outputs.
4. Point the next person or agent to `AGENTS.md`.

## License

See `LICENSE`.
