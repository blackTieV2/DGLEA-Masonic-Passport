module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.e2e-spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  roots: ["<rootDir>/test"],
  setupFiles: ["<rootDir>/test/setup-env.ts"],
  setupFilesAfterEnv: ["<rootDir>/test/setup-integration.ts"],
  globalSetup: "<rootDir>/test/global-setup.ts",
};
