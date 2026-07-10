# DGLEA Masonic Passport — Backend

A NestJS modular monolith providing the DGLEA Masonic Passport API.

## Prerequisites

- Node.js 20+
- npm or pnpm
- Docker + Docker Compose (for local PostgreSQL)
- A Firebase project and service account JSON (for auth verification)

## Install

```bash
cd backend
npm install
```

Copy the example environment file and fill in real values:

```bash
cp .env.example .env
```

Place your Firebase service account JSON at the path referenced by `GOOGLE_APPLICATION_CREDENTIALS` (do not commit it).

## Database setup

Start PostgreSQL locally:

```bash
docker compose up -d postgres
```

Generate the Prisma client and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

Seed the database with development data:

```bash
npm run db:seed
```

Reset the database (development only):

```bash
npm run db:reset
```

## Run

Development with hot reload:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm run start:prod
```

Full Docker Compose stack:

```bash
docker compose up --build
```

The API is available at `http://localhost:3000` and Swagger UI at `http://localhost:3000/api/docs`.

## Test

Unit and integration tests:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

Coverage:

```bash
npm run test:cov
```

Lint:

```bash
npm run lint
```

Type check:

```bash
npm run typecheck
```

## Scripts

| Script | Description |
|---|---|
| `dev` | Run in watch mode |
| `build` | Compile TypeScript |
| `start` | Run compiled output |
| `test` | Run Jest tests |
| `test:watch` | Run Jest in watch mode |
| `lint` | Run ESLint |
| `typecheck` | Run TypeScript without emit |
| `db:generate` | Generate Prisma client |
| `db:migrate` | Run Prisma migrations in dev |
| `db:deploy` | Deploy migrations in production |
| `db:seed` | Seed development data |
| `db:reset` | Reset database and seed (dev only) |
| `db:studio` | Open Prisma Studio |

## Development auth bypass

For local development only, set `DEV_AUTH_USER_ID` in `.env` to a user UUID to bypass Firebase token verification. Never set this in production.

## Security notes

- All permission decisions are enforced server-side.
- Firebase ID tokens are verified server-side with the Admin SDK.
- Secrets are loaded from `.env` and the service account JSON; neither is committed.
- Audit events are recorded for every mutating endpoint.
- The seed/reset endpoint is disabled in production.
