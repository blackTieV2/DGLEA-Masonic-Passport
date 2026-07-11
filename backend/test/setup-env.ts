process.env.NODE_ENV = "test";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    process.env.DATABASE_URL_TEST ??
    "postgresql://postgres:postgres@127.0.0.1:5432/dglea_passport_test";
}

// Note for integration tests: global-setup.ts requires DATABASE_URL_TEST to be set
// explicitly and will skip integration suites when it is missing or unreachable.
