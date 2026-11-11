/**
 * Schema and utility security tests.
 * Converted from node:test to Jest (the project test runner).
 */
import { describe, it, expect } from "@jest/globals";
import {
  userSchema,
  ticketSchema,
  staffSchema,
  ticketListQuerySchema,
  ticketAssignSchema,
} from "../src/utils/Schema.Validation.js";
import { escapeRegex, hashRefreshToken } from "../src/utils/utils.functions.js";
import { noSqlInjectionMiddleware } from "../src/middlewares/noSqlInjection.Middleware.js";

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

describe("Security: query and assignment validation", () => {
  it("rejects unsupported query keys and invalid pagination values", () => {
    expect(
      ticketListQuerySchema.validate({ $where: "this.x" }).error,
    ).toBeDefined();
    expect(ticketListQuerySchema.validate({ limit: 101 }).error).toBeDefined();
  });

  it("accepts only a valid assignee field", () => {
    expect(
      ticketAssignSchema.validate({ assignedTo: "0123456789abcdef01234567" })
        .error,
    ).toBeUndefined();
    expect(
      ticketAssignSchema.validate({ assignedTo: "invalid", status: "closed" })
        .error,
    ).toBeDefined();
  });

  it("escapes literal search strings instead of treating them as regex syntax", () => {
    expect(escapeRegex(".*ticket")).toBe("\\.\\*ticket");
  });

  it("rejects Mongo operator keys in request input", () => {
    let forwardedError;
    noSqlInjectionMiddleware(
      { body: { email: { $ne: null } }, query: {}, params: {} },
      {},
      (error) => {
        forwardedError = error;
      },
    );

    expect(forwardedError).toMatchObject({
      statusCode: 400,
      code: "UNSAFE_INPUT",
    });
  });
});
