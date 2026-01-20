//app.js is used to set up the Express application, including middlewares, routes, and error handling.

import express from "express";
import cors from "cors";

import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import todoRoutes from "./routes/todo.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json()); // Parse JSON body

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Error handling
app.use(errorHandler);
app.use(notFound);

export default app;


//The credentials: true setting in CORS configuration is a security permission that authorizes the browser to send sensitive authentication data—specifically cookies, authorization headers, and TLS client certificates—across different origins (e.g., from your React frontend to your Node backend). By default, browsers strictly block cross-origin requests from including these credentials to prevent security vulnerabilities. Therefore, if your application relies on cookies (like for Refresh Tokens) or secure headers, you must enable credentials: true. Crucially, when this setting is enabled, you cannot use the wildcard origin: '*' because it is considered insecure; you must instead explicitly specify the exact allowed origin (e.g., http://localhost:5173) to establish a trusted connection.