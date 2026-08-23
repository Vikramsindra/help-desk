import test from "node:test";
import assert from "node:assert/strict";
import {
  userSchema,
  ticketSchema,
  staffSchema,
} from "../src/utils/Schema.Validation.js";
import { hashRefreshToken } from "../src/utils/utils.functions.js";

test("public registration rejects a submitted role", () => {
  const result = userSchema.validate({
    name: "Attacker",
    email: "attacker@example.com",
    password: "Password@123",
    role: "admin",
  });
  assert.ok(result.error);
});

test("ticket creation rejects internal fields", () => {
  const result = ticketSchema.validate({
    title: "Issue",
    description: "Details",
    category: "Bug",
    status: "closed",
    assignedTo: null,
  });
  assert.ok(result.error);
});

test("staff creation only permits agent and admin", () => {
  assert.equal(
    staffSchema.validate({
      name: "Agent Name",
      email: "agent@example.com",
      password: "Password@123",
      role: "agent",
    }).error,
    undefined,
  );
  assert.ok(
    staffSchema.validate({
      name: "Root",
      email: "root@example.com",
      password: "Password@123",
      role: "super_admin",
    }).error,
  );
});

test("refresh token hashes are deterministic and one-way shaped", () => {
  assert.equal(hashRefreshToken("token"), hashRefreshToken("token"));
  assert.notEqual(hashRefreshToken("token"), "token");
});
