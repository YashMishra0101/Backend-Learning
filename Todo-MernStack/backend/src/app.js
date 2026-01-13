//app.js is used to set up the Express application, including middlewares, routes, and error handling. 

import express from "express";
import cors from "cors";

import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import todoRoutes from "./routes/todo.routes.js"


const app = express();

app.use(cors())
app.use(express.json()); // Parse JSON body

// Routes
app.use("/api/auth",authRoutes)
app.use("/api/todos",todoRoutes)

// Error handling
app.use(errorHandler)
app.use(notFound);

export default app;
