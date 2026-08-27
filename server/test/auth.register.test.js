import { describe, it, expect } from "@jest/globals";
import supertest from "supertest";
import { app } from "../src/app.js";

const request = supertest(app);

const VALID_USER = {
  name: "Test Register",
  email: "register@test.com",
  password: "Password@123",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const assertApiResponseShape = (body) => {
  expect(body).toHaveProperty("success", true);
  expect(body).toHaveProperty("message");
  expect(body).toHaveProperty("data");
};

const assertErrorShape = (body) => {
  expect(body).toHaveProperty("success", false);
  expect(body).toHaveProperty("error");
  expect(body.error).toHaveProperty("code");
  expect(body.error).toHaveProperty("message");
};

// ─── Registration tests ───────────────────────────────────────────────────────

describe("POST /api/user/register", () => {
  it("returns 201 with ApiResponse envelope on success", async () => {
    const res = await request.post("/api/user/register").send(VALID_USER);

    expect(res.status).toBe(201);
    assertApiResponseShape(res.body);
    expect(res.body.data).toHaveProperty("accessToken");
    expect(res.body.data).toHaveProperty("user");
  });

  it("returns user object with expected fields (no password)", async () => {
    const res = await request.post("/api/user/register").send(VALID_USER);

    const user = res.body.data.user;
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("role");
    expect(user).not.toHaveProperty("password");
    expect(user).not.toHaveProperty("refreshTokenHash");
  });

  it("sets a refreshToken cookie on success", async () => {
    const res = await request.post("/api/user/register").send(VALID_USER);

    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies.some((c) => c.startsWith("refreshToken="))).toBe(true);
  });

  it("returns 409 with error envelope when email already taken", async () => {
    // First registration
    await request.post("/api/user/register").send(VALID_USER);

    // Second registration with same email
    const res = await request.post("/api/user/register").send(VALID_USER);

    expect(res.status).toBe(409);
    assertErrorShape(res.body);
    expect(res.body.error.code).toBe("USER_ALREADY_EXISTS");
  });

  it("returns 400 with VALIDATION_ERROR for missing fields", async () => {
    const res = await request.post("/api/user/register").send({ name: "A" });

    expect(res.status).toBe(400);
    assertErrorShape(res.body);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 for weak password", async () => {
    const res = await request.post("/api/user/register").send({
      name: "Weak Password User",
      email: "weak@test.com",
      password: "password",
    });

    expect(res.status).toBe(400);
    assertErrorShape(res.body);
  });

  it("does not expose inconsistent keys like 'result' or 'record'", async () => {
    const res = await request.post("/api/user/register").send(VALID_USER);

    expect(res.body).not.toHaveProperty("result");
    expect(res.body).not.toHaveProperty("record");
    expect(res.body).not.toHaveProperty("ticketData");
    expect(res.body).not.toHaveProperty("responseData");
    expect(res.body).not.toHaveProperty("user"); // user is nested inside data
  });
});
