/**
 * Schema and utility security tests.
 * Converted from node:test to Jest (the project test runner).
 */
import { describe, it, expect } from "@jest/globals";
import {
  userSchema,
  ticketSchema,
  staffSchema,
} from "../src/utils/Schema.Validation.js";
import { hashRefreshToken } from "../src/utils/utils.functions.js";

describe("Security: public registration", () => {
  it("rejects a submitted role field", () => {
    const result = userSchema.validate({
      name: "Attacker",
      email: "attacker@example.com",
      password: "Password@123",
      role: "admin",
    });
    expect(result.error).toBeDefined();
  });
});

describe("Security: ticket creation", () => {
  it("rejects internal fields (status, assignedTo)", () => {
    const result = ticketSchema.validate({
      title: "Issue",
      description: "Details",
      category: "Bug",
      status: "closed",
      assignedTo: null,
    });
    expect(result.error).toBeDefined();
  });
});

describe("Security: staff creation", () => {
  it("permits agent role", () => {
    const { error } = staffSchema.validate({
      name: "Agent Name",
      email: "agent@example.com",
      password: "Password@123",
      role: "agent",
    });
    expect(error).toBeUndefined();
  });

  it("rejects super_admin role", () => {
    const { error } = staffSchema.validate({
      name: "Root",
      email: "root@example.com",
      password: "Password@123",
      role: "super_admin",
    });
    expect(error).toBeDefined();
  });
});

describe("Security: refresh token hashing", () => {
  it("hashes are deterministic", () => {
    expect(hashRefreshToken("token")).toBe(hashRefreshToken("token"));
  });

  it("hash is one-way (not equal to input)", () => {
    expect(hashRefreshToken("token")).not.toBe("token");
  });
});
