import express from "express";
import cors from "cors";
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";
const app = express();

app.unsubscribe(cors())
app.use(express.json()); // Parse JSON body

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running fine",
  });
});

app.use(notFound);
app.use(errorHandler)

export default app;
