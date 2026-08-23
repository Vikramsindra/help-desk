export default {
  testEnvironment: "node",
  transform: {},
  setupFileAfterEnv: ["<rootDir>/test/setup.js"],
  testMatch: ["<rootDir>/test/**/*.test.js"],
  clearMocks: true,
  collectConverageForm: ["src/**/*.js", "!src/models/**/*.js"],
  coverageDirectory: "converage",
};
