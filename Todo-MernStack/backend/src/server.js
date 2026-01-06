//server.js is the entry point of the application where the server is started
import app from "./app.js";
import { env } from "./config/env.js";
import connectDB from "./db.js";

const startServer = async () => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
