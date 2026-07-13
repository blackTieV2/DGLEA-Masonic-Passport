process.env.NODE_ENV = "test";

// Explicitly allow dev-auth bypass for the test suite. Production builds must
// keep this flag false.
process.env.ALLOW_DEV_AUTH = process.env.ALLOW_DEV_AUTH ?? "true";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    process.env.DATABASE_URL_TEST ??
    "postgresql://postgres:postgres@127.0.0.1:5432/dglea_passport_test";
}

// Note for integration tests: global-setup.ts requires DATABASE_URL_TEST to be set
// explicitly and will skip integration suites when it is missing or unreachable.
