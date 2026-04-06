# DGLEA Masonic Passport Backend

Backend foundation for the DGLEA Masonic Passport modular-monolith.

## Current module structure

The backend keeps a modular-monolith layout under `src/modules`:

- `identity-access`
- `lodge-district-admin`
- `member-profile`
- `passport`
- `mentor-assignment`
- `verification-workflow`
- `notifications`
- `reporting-analytics`
- `audit`
- `configuration`

## Prerequisites

- Node.js 20+
- npm 10+

## Install

```bash
cd backend
npm install
```

## Scripts

```bash
cd backend
npm run dev
npm run test
npm run lint
npm run build
npm run typecheck
```

## Database scaffolding

Database scaffolding lives in `db/`:

- initial migration skeleton: `db/migrations/0001_initial_schema.up.sql`
- migration rollback: `db/migrations/0001_initial_schema.down.sql`
- seed skeletons: `db/seeds/`
- fixture skeletons: `db/fixtures/`

## Notes

This foundation intentionally prioritises architecture, contracts, and test harness stability before full runtime wiring.
