import { describe, it, expect } from "@jest/globals";
import supertest from "supertest";
import { app } from "../src/app.js";

const request = supertest(app);

describe("GET /api/health", () => {
  it("returns 200 with status ok", async () => {
    const res = await request.get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  // NOTE: Health check is a documented exception to ApiResponse.
  // It returns a plain { status, message } object, not the ApiResponse envelope.
  it("does not use the ApiResponse envelope (documented exception)", async () => {
    const res = await request.get("/api/health");
    // It should NOT have the standard { success, message, data } shape
    // because health-check endpoints need a custom minimal shape.
    expect(res.body).not.toHaveProperty("data");
  });
});
