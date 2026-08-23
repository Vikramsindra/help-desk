import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDB from "./src/config/DBConnection.js";

import UserRoute from "./src/routes/User.Route.js";
import AdminRoute from "./src/routes/Admin.Route.js";
import TicketRoute from "./src/routes/Ticket.Route.js";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./src/middlewares/error.Middleware.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

const allowedOrigins = (process.env.FRONTEND_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", async (req, res) => {
  res.status(200).json({ status: "ok", message: "API is healthy" });
});

app.use("/api/user", UserRoute);
app.use("/api/admin", AdminRoute);
app.use("/api/tickets", TicketRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };

if (process.env.NODE_ENV !== "test") {
  connectToDB()
    .then(() => {
      app.listen(PORT, () => console.log(`Server is Running on ${PORT}`));
    })
    .catch(() => {
      console.error("Database connection failed; server not started.");
      process.exitCode = 1;
    });
}
