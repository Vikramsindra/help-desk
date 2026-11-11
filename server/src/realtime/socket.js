import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Server } from "socket.io";
import Ticket from "../models/Ticket.Model.js";
import User from "../models/User.Model.js";

let io;

const userRoom = (userId) => `user:${userId}`;
const ticketRoom = (ticketId) => `ticket:${ticketId}`;

const canAccessTicket = (ticket, user) => {
  if (["admin", "super_admin"].includes(user.role)) return true;
  if (user.role === "user") return String(ticket.createdBy) === user.id;
  return String(ticket.assignedTo || "") === user.id;
};

const getSocketToken = (socket) => {
  const authToken = socket.handshake.auth?.token;
  if (authToken) return authToken;

  const header = socket.handshake.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return null;
};

const authenticateSocket = async (socket, next) => {
  try {
    const token = getSocketToken(socket);
    if (!token) return next(new Error("TOKEN_MISSING"));

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || process.env.ACCESS_SECRET,
      { algorithms: ["HS256"] },
    );
    if (!decoded.id || !mongoose.Types.ObjectId.isValid(decoded.id)) {
      return next(new Error("TOKEN_INVALID"));
    }

    const user = await User.findById(decoded.id).select("role isActive");
    if (!user || user.isActive === false)
      return next(new Error("ACCOUNT_INACTIVE"));

    socket.user = { id: user._id.toString(), role: user.role };
    return next();
  } catch (error) {
    return next(
      new Error(
        error.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "TOKEN_INVALID",
      ),
    );
  }
};

const configureSocket = (httpServer, allowedOrigins) => {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use(authenticateSocket);
  io.on("connection", (socket) => {
    socket.join(userRoom(socket.user.id));

    socket.on("ticket:join", async (ticketId, acknowledge) => {
      const reply = typeof acknowledge === "function" ? acknowledge : () => {};
      if (!mongoose.Types.ObjectId.isValid(ticketId)) {
        return reply({ ok: false, code: "INVALID_TICKET_ID" });
      }

      const ticket = await Ticket.findById(ticketId).select(
        "createdBy assignedTo",
      );
      if (!ticket || !canAccessTicket(ticket, socket.user)) {
        return reply({ ok: false, code: "ACCESS_DENIED" });
      }

      socket.join(ticketRoom(ticketId));
      return reply({ ok: true });
    });

    socket.on("ticket:leave", (ticketId) => {
      if (mongoose.Types.ObjectId.isValid(ticketId)) {
        socket.leave(ticketRoom(ticketId));
      }
    });
  });

  return io;
};

const emitToUsers = (userIds, event, payload) => {
  if (!io) return;
  [...new Set(userIds.filter(Boolean).map(String))].forEach((userId) => {
    io.to(userRoom(userId)).emit(event, payload);
  });
};

const emitToTicketRoom = (ticketId, event, payload) => {
  if (!io || !ticketId) return;
  io.to(ticketRoom(ticketId)).emit(event, payload);
};

const emitToStaff = async (event, payload, excludeUserId) => {
  const staff = await User.find({
    role: { $in: ["admin", "super_admin"] },
    $or: [{ isActive: true }, { isActive: { $exists: false } }],
  }).select("_id");
  emitToUsers(
    staff
      .map(({ _id }) => _id)
      .filter((userId) => String(userId) !== String(excludeUserId || "")),
    event,
    payload,
  );
};

export {
  configureSocket,
  emitToStaff,
  emitToTicketRoom,
  emitToUsers,
  userRoom,
  ticketRoom,
};
