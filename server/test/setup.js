import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongod;

// ─── Global setup ─────────────────────────────────────────────────────────────

beforeAll(async () => {
  // Spin up an in-memory MongoDB instance
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // Set env vars needed by the app before connecting
  process.env.JWT_ACCESS_SECRET = "test-access-secret-32-chars-long!!";
  process.env.JWT_REFRESH_SECRET = "test-refresh-secret-32-chars-long!";
  process.env.NODE_ENV = "test";
  process.env.COOKIE_SAME_SITE = "lax";

  await mongoose.connect(uri);
});

// ─── Per-test cleanup ─────────────────────────────────────────────────────────

afterEach(async () => {
  // Clear all collections between tests to guarantee isolation
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// ─── Global teardown ──────────────────────────────────────────────────────────

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
