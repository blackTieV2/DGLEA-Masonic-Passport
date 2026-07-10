process.env.NODE_ENV = "test";
process.env.DATABASE_URL =
  process.env.DATABASE_URL_TEST ??
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:5432/dglea_passport_test";
