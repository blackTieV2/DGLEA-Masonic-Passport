# backend/src

Backend source code for the modular-monolith application.

## Layout

- `app/` — application entrypoint and composition root
- `modules/` — business-capability modules
- `shared/` — cross-module shared backend utilities
- `worker/` — background jobs and async processing

No microservices are introduced in this repository structure.
