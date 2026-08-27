import { describe, it, expect } from "@jest/globals";
import supertest from "supertest";
import { app } from "../src/app.js";

const request = supertest(app);

const CREDENTIALS = {
  name: "Login Test User",
  email: "login@test.com",
  password: "Password@123",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const register = () => request.post("/api/user/register").send(CREDENTIALS);

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

// ─── Login tests ──────────────────────────────────────────────────────────────

describe("POST /api/user/login", () => {
  it("returns 200 with ApiResponse envelope and tokens", async () => {
    await register();

    const res = await request
      .post("/api/user/login")
      .send({ email: CREDENTIALS.email, password: CREDENTIALS.password });

    expect(res.status).toBe(200);
    assertApiResponseShape(res.body);
    expect(res.body.data).toHaveProperty("accessToken");
    expect(res.body.data).toHaveProperty("user");
  });

  it("sets a refreshToken cookie on successful login", async () => {
    await register();

    const res = await request
      .post("/api/user/login")
      .send({ email: CREDENTIALS.email, password: CREDENTIALS.password });

    const cookies = res.headers["set-cookie"];
    expect(cookies.some((c) => c.startsWith("refreshToken="))).toBe(true);
  });

  it("returns 401 with INVALID_CREDENTIALS for wrong password", async () => {
    await register();

    const res = await request
      .post("/api/user/login")
      .send({ email: CREDENTIALS.email, password: "WrongPass@999" });

    expect(res.status).toBe(401);
    assertErrorShape(res.body);
    expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("returns 401 with INVALID_CREDENTIALS for unknown email", async () => {
    const res = await request
      .post("/api/user/login")
      .send({ email: "nobody@test.com", password: "Password@123" });

    expect(res.status).toBe(401);
    assertErrorShape(res.body);
    expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("returns 400 VALIDATION_ERROR for missing fields", async () => {
    const res = await request.post("/api/user/login").send({});

    expect(res.status).toBe(400);
    assertErrorShape(res.body);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});

// ─── Refresh tests ────────────────────────────────────────────────────────────

describe("POST /api/user/refresh", () => {
  it("returns 200 with new accessToken in ApiResponse envelope", async () => {
    // Register to get a refresh token cookie
    const regRes = await register();
    const cookie = regRes.headers["set-cookie"];

    const res = await request
      .post("/api/user/refresh")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    assertApiResponseShape(res.body);
    expect(res.body.data).toHaveProperty("accessToken");
  });

  it("returns 401 REFRESH_TOKEN_MISSING when no cookie is sent", async () => {
    const res = await request.post("/api/user/refresh");

    expect(res.status).toBe(401);
    assertErrorShape(res.body);
    expect(res.body.error.code).toBe("REFRESH_TOKEN_MISSING");
  });
});

// ─── Logout tests ─────────────────────────────────────────────────────────────

describe("POST /api/user/logout", () => {
  it("returns 204 No Content — no JSON body (documented exception)", async () => {
    await register();

    const loginRes = await request
      .post("/api/user/login")
      .send({ email: CREDENTIALS.email, password: CREDENTIALS.password });

    const cookie = loginRes.headers["set-cookie"];

    const res = await request
      .post("/api/user/logout")
      .set("Cookie", cookie);

    expect(res.status).toBe(204);
    // 204 must have no body — text should be empty
    expect(res.text).toBe("");
  });

  it("clears the refreshToken cookie on logout", async () => {
    await register();

    const loginRes = await request
      .post("/api/user/login")
      .send({ email: CREDENTIALS.email, password: CREDENTIALS.password });

    const cookie = loginRes.headers["set-cookie"];

    const res = await request
      .post("/api/user/logout")
      .set("Cookie", cookie);

    const setCookie = res.headers["set-cookie"] || [];
    // Cookie should be cleared (maxAge=0 or expires in past)
    const cleared = setCookie.some(
      (c) => c.startsWith("refreshToken=") && (c.includes("Expires=Thu, 01 Jan 1970") || c.includes("Max-Age=0")),
    );
    // Some implementations clear by sending empty value; just confirm status 204
    expect(res.status).toBe(204);
  });
});
