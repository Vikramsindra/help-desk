import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import UserRoute from "./routes/User.Route.js";
import AdminRoute from "./routes/Admin.Route.js";
import TicketRoute from "./routes/Ticket.Route.js";
import NotificationRoute from "./routes/Notification.Route.js";
import ApiError from "./utils/ApiError.js";
import { noSqlInjectionMiddleware } from "./middlewares/noSqlInjection.Middleware.js";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middlewares/error.Middleware.js";

const app = express();
app.use(helmet());

const allowedOrigins = (process.env.FRONTEND_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
if (allowedOrigins.includes("*")) {
  throw new Error(
    "FRONTEND_ORIGINS must not contain a wildcard when credentials are enabled",
  );
}
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      return callback(
        new ApiError(403, "ORIGIN_NOT_ALLOWED", "Origin not allowed"),
      );
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));
app.use(cookieParser());
app.use(noSqlInjectionMiddleware);

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
  handler: (req, res, next) =>
    next(new ApiError(429, "RATE_LIMITED", "Too many authentication attempts")),
});

app.get("/api/health", async (req, res) => {
  res.status(200).json({ status: "ok", message: "API is healthy" });
});

app.use("/api/user/login", authRateLimit);
app.use("/api/user/register", authRateLimit);
app.use("/api/user/refresh", authRateLimit);
app.use("/api/user", UserRoute);
app.use("/api/admin", AdminRoute);
app.use("/api/tickets", TicketRoute);
app.use("/api/notifications", NotificationRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app, allowedOrigins };
