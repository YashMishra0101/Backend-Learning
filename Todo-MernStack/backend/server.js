//The Brain / Command Center.

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

// Connect to Database BEFORE listening to requests
// It is best practice to connect to the DB as soon as the app starts.

connectDB();

const PORT = process.env.PORT || 5000;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello ji Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
