import supertest from "supertest";
import argon2 from "argon2";
import User from "../../src/models/User.Model.js";
import Ticket from "../../src/models/Ticket.Model.js";
import { app } from "../../src/app.js";

const request = supertest(app);

/**
 * Create a user directly in the DB (no HTTP round-trip).
 * @param {object} overrides - Fields to override defaults
 */
export const createUser = async (overrides = {}) => {
  const defaults = {
    name: "Test User",
    email: `user_${Date.now()}@example.com`,
    password: await argon2.hash("Password@123"),
    role: "user",
  };
  return User.create({ ...defaults, ...overrides });
};

/**
 * Login via the HTTP API and return the access token + Set-Cookie header.
 * @param {string} email
 * @param {string} password  Plain-text password
 */
export const loginUser = async (email, password = "Password@123") => {
  const res = await request
    .post("/api/user/login")
    .send({ email, password });

  return {
    accessToken: res.body.data?.accessToken,
    cookie: res.headers["set-cookie"],
    status: res.status,
    body: res.body,
  };
};

/**
 * Return a Bearer authorization header object for supertest.
 * @param {string} token
 */
export const authHeader = (token) => ({
  Authorization: `Bearer ${token}`,
});

/**
 * Create a ticket directly in the DB.
 * @param {string} createdById  Mongoose ObjectId string of the owning user
 * @param {object} overrides
 */
export const createTicket = async (createdById, overrides = {}) => {
  const defaults = {
    title: "Sample Ticket",
    description: "A test ticket description",
    category: "General",
    priority: "medium",
    status: "open",
    createdBy: createdById,
    assignedTo: null,
  };
  return Ticket.create({ ...defaults, ...overrides });
};
