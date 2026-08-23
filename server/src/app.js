import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import UserRoute from "./routes/User.Route.js";
import AdminRoute from "./routes/Admin.Route.js";
import TicketRoute from "./routes/Ticket.Route.js";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middlewares/error.Middleware.js";

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
