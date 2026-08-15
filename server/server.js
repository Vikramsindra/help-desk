import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectToDB from "./src/config/DBConnection.js";
import User from "./src/models/User.Model.js";

import UserRoute from "./src/routes/User.Route.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/api/health", async (req, res) => {
    res.status(200).json({ status: "ok", message: "API is healthy" });
});

app.use("/api/user", UserRoute);

app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`);
    connectToDB();
});