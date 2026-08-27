export default {
  testEnvironment: "node",
  transform: {},
  setupFilesAfterEnv: ["<rootDir>/test/setup.js"],
  testMatch: ["<rootDir>/test/**/*.test.js"],
  clearMocks: true,
  testTimeout: 30000,
  collectCoverageFrom: ["src/**/*.js", "!src/models/**/*.js"],
  coverageDirectory: "coverage",
};
