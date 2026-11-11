import crypto from "node:crypto";
import dotenv from "dotenv";
import argon2 from "argon2";
import mongoose from "mongoose";
import User from "../src/models/User.Model.js";
import Ticket from "../src/models/Ticket.Model.js";
import connectToDB from "../src/config/DBConnection.js";

dotenv.config();

const sampleAccounts = [
  {
    key: "customer",
    name: "Demo Customer",
    email: "demo.customer@example.com",
    role: "user",
  },
  {
    key: "agent",
    name: "Demo Agent",
    email: "demo.agent@example.com",
    role: "agent",
  },
  {
    key: "admin",
    name: "Demo Admin",
    email: "demo.admin@example.com",
    role: "admin",
  },
  {
    key: "superAdmin",
    name: "Demo Super Admin",
    email: "demo.superadmin@example.com",
    role: "super_admin",
  },
];

const sampleTickets = [
  {
    title: "[DEMO] Unable to sign in after password reset",
    description:
      "The password reset link was accepted, but sign-in still fails. Please check the account and advise on next steps.",
    category: "Account Access",
    priority: "high",
    status: "open",
  },
  {
    title: "[DEMO] Billing contact needs an update",
    description:
      "Please update the billing contact details for the next invoice cycle.",
    category: "Billing",
    priority: "medium",
    status: "in progress",
    assigned: true,
  },
  {
    title: "[DEMO] Report export is missing recent tickets",
    description:
      "The downloaded report does not include tickets created today. Please investigate the export date range.",
    category: "Technical Support",
    priority: "high",
    status: "in progress",
    assigned: true,
  },
  {
    title: "[DEMO] Request for keyboard navigation support",
    description:
      "Could the ticket list support full keyboard navigation for common actions?",
    category: "Feature Request",
    priority: "low",
    status: "open",
  },
  {
    title: "[DEMO] Notification preferences clarified",
    description:
      "The notification settings were reviewed and the expected behavior was confirmed.",
    category: "General",
    priority: "low",
    status: "resolved",
    assigned: true,
  },
];

const runSeed = async () => {
  if (process.env.SEED_DEMO_DATA !== "true") {
    throw new Error(
      "Set SEED_DEMO_DATA=true to explicitly enable demo seeding",
    );
  }

  await connectToDB();
  const accounts = new Map();
  const newCredentials = [];
  let existingAccountCount = 0;

  for (const account of sampleAccounts) {
    let user = await User.findOne({ email: account.email });
    if (user) {
      if (user.role !== account.role) {
        throw new Error(
          `Reserved demo email ${account.email} already has role ${user.role}`,
        );
      }
      if (user.isActive === false) {
        throw new Error(`Reserved demo account ${account.email} is inactive`);
      }
      existingAccountCount += 1;
    } else {
      const password = crypto.randomBytes(18).toString("base64url");
      user = await User.create({
        name: account.name,
        email: account.email,
        password: await argon2.hash(password),
        role: account.role,
        isActive: true,
      });
      newCredentials.push({
        email: account.email,
        password,
        role: account.role,
      });
    }
    accounts.set(account.key, user);
  }

  const customer = accounts.get("customer");
  const agent = accounts.get("agent");
  let createdTicketCount = 0;
  let existingTicketCount = 0;

  for (const ticket of sampleTickets) {
    const existing = await Ticket.findOne({
      createdBy: customer._id,
      title: ticket.title,
    });
    if (existing) {
      existingTicketCount += 1;
      continue;
    }

    const assignedTo = ticket.assigned ? agent._id : null;
    await Ticket.create({
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      createdBy: customer._id,
      assignedTo,
      assignedAt: assignedTo ? new Date() : null,
    });
    createdTicketCount += 1;
  }

  console.log(
    `Demo users ready: ${sampleAccounts.length - newCredentials.length} reused, ${newCredentials.length} created.`,
  );
  console.log(
    `Demo tickets ready: ${existingTicketCount} reused, ${createdTicketCount} created.`,
  );

  if (newCredentials.length) {
    console.log("Credentials for newly created demo accounts:");
    newCredentials.forEach(({ email, password, role }) => {
      console.log(`${role}: ${email} / ${password}`);
    });
  } else {
    console.log(
      "All demo accounts already exist; their passwords were not changed.",
    );
  }
};

try {
  await runSeed();
} catch (error) {
  console.error("Demo seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
