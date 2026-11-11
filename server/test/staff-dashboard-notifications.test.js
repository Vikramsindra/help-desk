import { beforeEach, describe, expect, it } from "@jest/globals";
import supertest from "supertest";
import { app } from "../src/app.js";
import Notification from "../src/models/Notification.Model.js";
import {
  authHeader,
  createTicket,
  createUser,
  loginUser,
} from "./helpers/factories.js";

const request = supertest(app);

let customer;
let agent;
let admin;
let superAdmin;
let customerToken;
let agentToken;
let adminToken;
let superAdminToken;

beforeEach(async () => {
  customer = await createUser({
    email: "staff-customer@test.com",
    role: "user",
  });
  agent = await createUser({ email: "staff-agent@test.com", role: "agent" });
  admin = await createUser({ email: "staff-admin@test.com", role: "admin" });
  superAdmin = await createUser({
    email: "staff-superadmin@test.com",
    role: "super_admin",
  });
  customerToken = (await loginUser(customer.email)).accessToken;
  agentToken = (await loginUser(agent.email)).accessToken;
  adminToken = (await loginUser(admin.email)).accessToken;
  superAdminToken = (await loginUser(superAdmin.email)).accessToken;
});

describe("staff management", () => {
  it("restricts listing and account changes to super-admins", async () => {
    const denied = await request
      .get("/api/admin/users")
      .set(authHeader(adminToken));
    const listed = await request
      .get("/api/admin/users?role=agent")
      .set(authHeader(superAdminToken));

    expect(denied.status).toBe(403);
    expect(listed.status).toBe(200);
    expect(listed.body.data.items).toHaveLength(1);
    expect(listed.body.data.items[0]).not.toHaveProperty("password");
  });

  it("deactivates staff and immediately rejects their existing access token", async () => {
    const updated = await request
      .patch(`/api/admin/users/${agent._id}`)
      .set(authHeader(superAdminToken))
      .send({ isActive: false });
    const me = await request.get("/api/user/me").set(authHeader(agentToken));

    expect(updated.status).toBe(200);
    expect(updated.body.data.isActive).toBe(false);
    expect(me.status).toBe(401);
  });

  it("allows super-admins to create staff but denies admins", async () => {
    const staff = {
      name: "New Support Agent",
      email: "new-support-agent@test.com",
      password: "Password@123",
      role: "agent",
    };
    const denied = await request
      .post("/api/admin/users")
      .set(authHeader(adminToken))
      .send(staff);
    const created = await request
      .post("/api/admin/users")
      .set(authHeader(superAdminToken))
      .send(staff);

    expect(denied.status).toBe(403);
    expect(created.status).toBe(201);
    expect(created.body.data).not.toHaveProperty("password");
  });
});

describe("dashboard statistics", () => {
  it("returns aggregate summaries for administrators", async () => {
    await createTicket(customer._id, { status: "open", priority: "high" });
    await createTicket(customer._id, {
      status: "resolved",
      priority: "low",
    });

    const res = await request
      .get("/api/tickets/dashboard/stats")
      .set(authHeader(adminToken));

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      totalTickets: 2,
      totalUsers: 1,
      totalAgents: 1,
      totalAdministrators: 1,
      ticketsByStatus: { open: 1, resolved: 1 },
      ticketsByPriority: { high: 1, low: 1 },
    });
  });
});

describe("notifications", () => {
  it("creates ticket event notifications and allows only the recipient to read them", async () => {
    const created = await request
      .post("/api/tickets")
      .set(authHeader(customerToken))
      .send({
        title: "Cannot access portal",
        description: "The portal returns an error",
        category: "Access",
      });
    const notification = await Notification.findOne({
      user: admin._id,
      ticket: created.body.data._id,
      type: "ticket_created",
    });
    const list = await request
      .get("/api/notifications")
      .set(authHeader(adminToken));
    const denied = await request
      .patch(`/api/notifications/${notification._id}/read`)
      .set(authHeader(customerToken));
    const marked = await request
      .patch(`/api/notifications/${notification._id}/read`)
      .set(authHeader(adminToken));

    expect(created.status).toBe(201);
    expect(notification).not.toBeNull();
    expect(list.status).toBe(200);
    expect(list.body.data.items[0]._id).toBe(notification._id.toString());
    expect(denied.status).toBe(404);
    expect(marked.status).toBe(200);
    expect(marked.body.data.isRead).toBe(true);
  });
});
