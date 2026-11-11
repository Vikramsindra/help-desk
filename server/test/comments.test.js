import { beforeEach, describe, expect, it } from "@jest/globals";
import supertest from "supertest";
import { app } from "../src/app.js";
import Comment from "../src/models/Comment.Model.js";
import {
  authHeader,
  createTicket,
  createUser,
  loginUser,
} from "./helpers/factories.js";

const request = supertest(app);

let customer;
let agent;
let customerToken;
let agentToken;
let ticket;

beforeEach(async () => {
  customer = await createUser({
    email: "comment-customer@test.com",
    role: "user",
  });
  agent = await createUser({ email: "comment-agent@test.com", role: "agent" });
  customerToken = (await loginUser(customer.email)).accessToken;
  agentToken = (await loginUser(agent.email)).accessToken;
  ticket = await createTicket(customer._id, { assignedTo: agent._id });
});

describe("ticket comments", () => {
  it("hides internal comments from customers and returns comments chronologically", async () => {
    await Comment.create({
      ticket: ticket._id,
      author: agent._id,
      message: "Internal note",
      isInternal: true,
      createdAt: new Date("2026-01-02T00:00:00Z"),
    });
    await Comment.create({
      ticket: ticket._id,
      author: customer._id,
      message: "Public reply",
      isInternal: false,
      createdAt: new Date("2026-01-01T00:00:00Z"),
    });

    const res = await request
      .get(`/api/tickets/${ticket._id}/comments`)
      .set(authHeader(customerToken));

    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].message).toBe("Public reply");
    expect(res.body.data.items[0].isInternal).toBe(false);
  });

  it("rejects internal comments from customers", async () => {
    const res = await request
      .post(`/api/tickets/${ticket._id}/comments`)
      .set(authHeader(customerToken))
      .send({ message: "Private note", isInternal: true });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("INTERNAL_COMMENT_FORBIDDEN");
  });

  it("allows assigned staff to create internal comments", async () => {
    const res = await request
      .post(`/api/tickets/${ticket._id}/comments`)
      .set(authHeader(agentToken))
      .send({ message: "Staff-only note", isInternal: true });

    expect(res.status).toBe(201);
    expect(res.body.data.isInternal).toBe(true);
  });

  it("returns comments in chronological order", async () => {
    await Comment.create({
      ticket: ticket._id,
      author: customer._id,
      message: "Second",
      createdAt: new Date("2026-01-02T00:00:00Z"),
    });
    await Comment.create({
      ticket: ticket._id,
      author: customer._id,
      message: "First",
      createdAt: new Date("2026-01-01T00:00:00Z"),
    });

    const res = await request
      .get(`/api/tickets/${ticket._id}/comments`)
      .set(authHeader(customerToken));

    expect(res.body.data.items.map((comment) => comment.message)).toEqual([
      "First",
      "Second",
    ]);
  });
});
