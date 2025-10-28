import express from "express";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Connect to DB
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
