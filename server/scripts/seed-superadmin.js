import dotenv from "dotenv";
import argon2 from "argon2";
import User from "../src/models/User.Model.js";
import connectToDB from "../src/config/DBConnection.js";
import mongoose from "mongoose";

dotenv.config();

const required = [
  "SUPER_ADMIN_NAME",
  "SUPER_ADMIN_EMAIL",
  "SUPER_ADMIN_PASSWORD",
];
const missing = required.filter((name) => !process.env[name]);

if (missing.length) {
  console.error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
  process.exitCode = 1;
} else {
  try {
    await connectToDB();
    const email = process.env.SUPER_ADMIN_EMAIL.trim().toLowerCase();
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Super-admin email already exists; no account created.");
    } else {
      await User.create({
        name: process.env.SUPER_ADMIN_NAME.trim(),
        email,
        password: await argon2.hash(process.env.SUPER_ADMIN_PASSWORD),
        role: "super_admin",
      });
      console.log("Super-admin created.");
    }
  } catch (error) {
    console.error(`Super-admin seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
