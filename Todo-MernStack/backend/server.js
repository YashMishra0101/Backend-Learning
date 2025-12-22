//The Brain / Command Center.

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

// Connect to Database BEFORE listening to requests
// It is best practice to connect to the DB as soon as the app starts.

connectDB();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello ji Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
