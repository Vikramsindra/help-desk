import { describe, it, expect } from "@jest/globals";
import supertest from "supertest";
import { app } from "../src/app.js";
import ApiError from "../src/utils/ApiError.js";
import { errorMiddleware } from "../src/middlewares/error.Middleware.js";

const request = supertest(app);

// ─── ApiError unit tests ──────────────────────────────────────────────────────

describe("ApiError", () => {
  it("extends Error", () => {
    const err = new ApiError(404, "NOT_FOUND", "Not found");
    expect(err).toBeInstanceOf(Error);
  });

  it("sets statusCode, code, message correctly", () => {
    const err = new ApiError(422, "VALIDATION_ERROR", "Invalid input");
    expect(err.statusCode).toBe(422);
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.message).toBe("Invalid input");
  });

  it("sets isOperational to true", () => {
    const err = new ApiError(400, "BAD_REQUEST", "Bad");
    expect(err.isOperational).toBe(true);
  });

  it("stores details when provided", () => {
    const details = [{ field: "email", message: "Required" }];
    const err = new ApiError(400, "VALIDATION_ERROR", "Invalid", details);
    expect(err.details).toEqual(details);
  });

  it("leaves details undefined when not provided", () => {
    const err = new ApiError(400, "BAD", "Bad");
    expect(err.details).toBeUndefined();
  });

  it("has a stack trace", () => {
    const err = new ApiError(500, "INTERNAL_ERROR", "Oops");
    expect(err.stack).toBeDefined();
  });
});

// ─── Error middleware unit tests ──────────────────────────────────────────────

describe("errorMiddleware", () => {
  const mockReq = {};
  const mockNext = () => {};

  const makeRes = () => {
    const res = {};
    res.status = (code) => { res._status = code; return res; };
    res.json = (body) => { res._body = body; return res; };
    return res;
  };

  it("responds with ApiError statusCode and envelope for operational errors", () => {
    const res = makeRes();
    const err = new ApiError(404, "NOT_FOUND", "Resource not found");

    errorMiddleware(err, mockReq, res, mockNext);

    expect(res._status).toBe(404);
    expect(res._body.success).toBe(false);
    expect(res._body.error.code).toBe("NOT_FOUND");
    expect(res._body.error.message).toBe("Resource not found");
  });

  it("includes details in the envelope when present on ApiError", () => {
    const res = makeRes();
    const details = [{ field: "title", msg: "required" }];
    const err = new ApiError(400, "VALIDATION_ERROR", "Bad input", details);

    errorMiddleware(err, mockReq, res, mockNext);

    expect(res._body.error.details).toEqual(details);
  });

  it("omits details key when details is undefined", () => {
    const res = makeRes();
    const err = new ApiError(400, "BAD", "Bad");

    errorMiddleware(err, mockReq, res, mockNext);

    expect(res._body.error).not.toHaveProperty("details");
  });

  it("responds with 500 and INTERNAL_ERROR for unexpected errors", () => {
    const res = makeRes();
    const err = new Error("Something unexpected");   // isOperational not set

    errorMiddleware(err, mockReq, res, mockNext);

    expect(res._status).toBe(500);
    expect(res._body.success).toBe(false);
    expect(res._body.error.code).toBe("INTERNAL_ERROR");
    expect(res._body.error.message).toBe("Internal server error");
  });

  it("never leaks a stack trace in the response body", () => {
    const res = makeRes();
    const err = new Error("DB exploded");

    errorMiddleware(err, mockReq, res, mockNext);

    expect(JSON.stringify(res._body)).not.toContain("at Object.");
    expect(res._body.error).not.toHaveProperty("stack");
  });
});

// ─── 404 integration test ─────────────────────────────────────────────────────

describe("notFoundMiddleware (integration)", () => {
  it("returns 404 with ROUTE_NOT_FOUND error envelope for unknown routes", async () => {
    const res = await request.get("/api/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("ROUTE_NOT_FOUND");
    expect(res.body.error).toHaveProperty("message");
  });
});
