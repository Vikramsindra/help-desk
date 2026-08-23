import { app } from "./src/app.js";
import connectToDB from "./src/config/DBConnection.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    await connectToDB();
    app.listen(PORT, () => {
      console.log(`Server is Running on ${PORT}`);
    });
  } catch (error) {
    console.log("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
