export default {
  testEnvironment: "node",
  transform: {},
  testMatch: [
    "<rootDir>/test/security.test.js",
    "<rootDir>/test/api-error.test.js",
  ],
  clearMocks: true,
  testTimeout: 30000,
};
