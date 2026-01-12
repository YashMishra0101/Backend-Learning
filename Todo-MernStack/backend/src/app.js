import express from "express";
//app.js is used to set up the Express application, including middlewares, routes, and error handling. 
import cors from "cors";
import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import { protect } from "./middlewares/auth.middleware.js";

const app = express();

app.use(cors())
app.use(express.json()); // Parse JSON body

app.use("/api/auth",authRoutes)
app.get("/api/protected-test", protect, (req, res) => {
  res.json({
    success: true,
    message: "You are authorized",
    user: req.user,
  });
});
app.use(errorHandler)
app.use(notFound);

export default app;
