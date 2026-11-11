import http from "node:http";
import { app } from "./src/app.js";
import { allowedOrigins } from "./src/app.js";
import connectToDB from "./src/config/DBConnection.js";
import dotenv from "dotenv";
import { configureSocket } from "./src/realtime/socket.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    await connectToDB();
    const httpServer = http.createServer(app);
    configureSocket(httpServer, allowedOrigins);
    httpServer.listen(PORT, () => {
      console.log(`Server is Running on ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed", { name: error.name });
    process.exit(1);
  }
}

startServer();
