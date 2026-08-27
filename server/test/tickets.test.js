import { describe, it, expect, beforeEach } from "@jest/globals";
import supertest from "supertest";
import { app } from "../src/app.js";
import {
  createUser,
  createTicket,
  loginUser,
  authHeader,
} from "./helpers/factories.js";

const request = supertest(app);

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

const assertPaginationShape = (pagination) => {
  expect(pagination).toHaveProperty("page");
  expect(pagination).toHaveProperty("limit");
  expect(pagination).toHaveProperty("totalItems");
  expect(pagination).toHaveProperty("totalPages");
  expect(pagination).toHaveProperty("hasNextPage");
  expect(pagination).toHaveProperty("hasPreviousPage");
};

// ─── Test state ───────────────────────────────────────────────────────────────

let user, userToken;
let admin, adminToken;
let agent, agentToken;

beforeEach(async () => {
  user = await createUser({ email: "user@tickets.com", role: "user" });
  const userLogin = await loginUser("user@tickets.com");
  userToken = userLogin.accessToken;

  admin = await createUser({ email: "admin@tickets.com", role: "admin" });
  const adminLogin = await loginUser("admin@tickets.com");
  adminToken = adminLogin.accessToken;

  agent = await createUser({ email: "agent@tickets.com", role: "agent" });
  const agentLogin = await loginUser("agent@tickets.com");
  agentToken = agentLogin.accessToken;
});

// ─── POST /api/tickets — Create ───────────────────────────────────────────────

describe("POST /api/tickets (mutation — create)", () => {
  it("returns 201 with ApiResponse envelope", async () => {
    const res = await request
      .post("/api/tickets")
      .set(authHeader(userToken))
      .send({ title: "Bug", description: "Something broke", category: "Tech" });

    expect(res.status).toBe(201);
    assertApiResponseShape(res.body);
    expect(res.body.data).toHaveProperty("_id");
    expect(res.body.data).toHaveProperty("title", "Bug");
  });

  it("does not expose 'ticket' at the top level — must be in data", async () => {
    const res = await request
      .post("/api/tickets")
      .set(authHeader(userToken))
      .send({ title: "Bug", description: "Something broke", category: "Tech" });

    expect(res.body).not.toHaveProperty("ticket");
    expect(res.body).not.toHaveProperty("result");
  });

  it("returns 400 VALIDATION_ERROR for missing required fields", async () => {
    const res = await request
      .post("/api/tickets")
      .set(authHeader(userToken))
      .send({});

    expect(res.status).toBe(400);
    assertErrorShape(res.body);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 401 when no token is provided", async () => {
    const res = await request
      .post("/api/tickets")
      .send({ title: "Bug", description: "Test", category: "Tech" });

    expect(res.status).toBe(401);
    assertErrorShape(res.body);
  });
});

// ─── GET /api/tickets/admin — List (admin) ────────────────────────────────────

describe("GET /api/tickets/admin (list — admin)", () => {
  it("returns 200 with data.items and data.pagination", async () => {
    await createTicket(user._id);
    await createTicket(user._id, { title: "Second" });

    const res = await request
      .get("/api/tickets/admin")
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    assertApiResponseShape(res.body);
    expect(Array.isArray(res.body.data.items)).toBe(true);
    expect(res.body.data.items.length).toBeGreaterThanOrEqual(2);
    assertPaginationShape(res.body.data.pagination);
  });

  it("pagination has correct totalItems count", async () => {
    await createTicket(user._id);

    const res = await request
      .get("/api/tickets/admin")
      .set(authHeader(adminToken));

    expect(res.body.data.pagination.totalItems).toBeGreaterThanOrEqual(1);
  });

  it("does not use deprecated key 'tickets' at top level", async () => {
    const res = await request
      .get("/api/tickets/admin")
      .set(authHeader(adminToken));

    expect(res.body).not.toHaveProperty("tickets");
    expect(res.body.data).not.toHaveProperty("tickets");
  });

  it("does not use deprecated key 'totalTickets' in pagination", async () => {
    const res = await request
      .get("/api/tickets/admin")
      .set(authHeader(adminToken));

    expect(res.body.data.pagination).not.toHaveProperty("totalTickets");
  });

  it("returns 403 ACCESS_DENIED for non-admin users", async () => {
    const res = await request
      .get("/api/tickets/admin")
      .set(authHeader(userToken));

    expect(res.status).toBe(403);
    assertErrorShape(res.body);
  });
});

// ─── GET /api/tickets/my-ticket — My tickets ─────────────────────────────────

describe("GET /api/tickets/my-ticket (list — user)", () => {
  it("returns 200 with data.items", async () => {
    await createTicket(user._id);

    const res = await request
      .get("/api/tickets/my-ticket")
      .set(authHeader(userToken));

    expect(res.status).toBe(200);
    assertApiResponseShape(res.body);
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });

  it("only returns tickets belonging to the current user", async () => {
    const otherUser = await createUser({ email: "other@tickets.com" });
    await createTicket(otherUser._id, { title: "Other ticket" });
    await createTicket(user._id, { title: "My ticket" });

    const res = await request
      .get("/api/tickets/my-ticket")
      .set(authHeader(userToken));

    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].title).toBe("My ticket");
  });
});

// ─── GET /api/tickets/:id — Single resource ───────────────────────────────────

describe("GET /api/tickets/:id (single resource)", () => {
  it("returns 200 with ApiResponse envelope wrapping the ticket", async () => {
    const ticket = await createTicket(user._id);

    const res = await request
      .get(`/api/tickets/${ticket._id}`)
      .set(authHeader(userToken));

    expect(res.status).toBe(200);
    assertApiResponseShape(res.body);
    expect(res.body.data).toHaveProperty("_id");
    expect(res.body.data._id.toString()).toBe(ticket._id.toString());
  });

  it("response data is NOT the raw ticket at top level", async () => {
    const ticket = await createTicket(user._id);

    const res = await request
      .get(`/api/tickets/${ticket._id}`)
      .set(authHeader(userToken));

    // The old code returned res.json(ticket) — bare object at root
    expect(res.body).not.toHaveProperty("_id");
    expect(res.body).not.toHaveProperty("title");
  });

  it("returns 404 TICKET_NOT_FOUND for non-existent ticket", async () => {
    const fakeId = "000000000000000000000001";
    const res = await request
      .get(`/api/tickets/${fakeId}`)
      .set(authHeader(userToken));

    expect(res.status).toBe(404);
    assertErrorShape(res.body);
    expect(res.body.error.code).toBe("TICKET_NOT_FOUND");
  });

  it("returns 400 INVALID_TICKET_ID for malformed ID", async () => {
    const res = await request
      .get("/api/tickets/not-an-id")
      .set(authHeader(userToken));

    expect(res.status).toBe(400);
    assertErrorShape(res.body);
    expect(res.body.error.code).toBe("INVALID_TICKET_ID");
  });
});

// ─── PATCH /api/tickets/:id — Update (mutation) ───────────────────────────────

describe("PATCH /api/tickets/:id (mutation — update)", () => {
  it("returns 200 with ApiResponse envelope containing updated ticket", async () => {
    const ticket = await createTicket(user._id);

    const res = await request
      .patch(`/api/tickets/${ticket._id}`)
      .set(authHeader(userToken))
      .send({ title: "Updated Title" });

    expect(res.status).toBe(200);
    assertApiResponseShape(res.body);
    expect(res.body.data).toHaveProperty("title", "Updated Title");
  });

  it("does not expose 'ticket' key at the top level", async () => {
    const ticket = await createTicket(user._id);

    const res = await request
      .patch(`/api/tickets/${ticket._id}`)
      .set(authHeader(userToken))
      .send({ title: "Updated" });

    expect(res.body).not.toHaveProperty("ticket");
  });
});

// ─── DELETE /api/tickets/:id ──────────────────────────────────────────────────

describe("DELETE /api/tickets/:id", () => {
  it("returns 200 with ApiResponse containing ticketId", async () => {
    const ticket = await createTicket(user._id);

    const res = await request
      .delete(`/api/tickets/${ticket._id}`)
      .set(authHeader(userToken));

    expect(res.status).toBe(200);
    assertApiResponseShape(res.body);
    expect(res.body.data).toHaveProperty("ticketId");
  });

  it("returns 403 AGENT_DELETE_FORBIDDEN when agent tries to delete", async () => {
    const ticket = await createTicket(user._id, { assignedTo: agent._id });

    const res = await request
      .delete(`/api/tickets/${ticket._id}`)
      .set(authHeader(agentToken));

    expect(res.status).toBe(403);
    assertErrorShape(res.body);
    expect(res.body.error.code).toBe("AGENT_DELETE_FORBIDDEN");
  });
});
