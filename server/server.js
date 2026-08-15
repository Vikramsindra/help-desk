import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDB from "./src/config/DBConnection.js";

import UserRoute from "./src/routes/User.Route.js";
import TicketRoute from "./src/routes/Ticket.Route.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", async (req, res) => {
    res.status(200).json({ status: "ok", message: "API is healthy" });
});

app.use("/api/user", UserRoute);
app.use("/api/ticket", TicketRoute);

app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`);
    connectToDB();
});