import express from "express";
import cors from "cors";
import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors())
app.use(express.json()); // Parse JSON body

app.use("/api/auth",authRoutes)

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running fine",
  });
});


app.use(notFound);
app.use(errorHandler)

export default app;
