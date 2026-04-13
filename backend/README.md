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
npm run migrate
npm run seed
npm run fixture:apply
```

## HTTP transport

A minimal Fastify transport is wired for implemented slices:

- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`
- `GET /me`
- `POST /members/{memberId}/passport-records`
- `PATCH /passport-records/{recordId}`
- `POST /passport-records/{recordId}/submit`
- `POST /passport-records/{recordId}/verify`
- `POST /passport-records/{recordId}/reject`
- `POST /passport-records/{recordId}/clarification`
- `POST /passport-records/{recordId}/override`
- `GET /verification-queue`

Start locally:

```bash
cd backend
npm run dev
```

## Database scaffolding

Database scaffolding lives in `db/`:

- initial migration skeleton: `db/migrations/0001_initial_schema.up.sql`
- migration rollback: `db/migrations/0001_initial_schema.down.sql`
- seed skeletons: `db/seeds/`
- fixture skeletons: `db/fixtures/`

## Notes

This foundation intentionally prioritises architecture, contracts, and test harness stability before full runtime wiring.
