import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

//Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";

//routes declaration
app.use("/api/v1/users",userRouter);

export { app };




/*
## Middlewares

### 🧠 `app.use(express.json({ limit: "16kb" }))`

This middleware allows your backend to accept JSON data from incoming requests — like POST, PUT, etc.

### 🧠 `app.use(express.urlencoded({ extended: true, limit: "16kb" }))`

It means — the maximum size of JSON payload allowed is 16 kilobytes.
If someone tries to send too large a JSON (like 5MB), the server rejects it to protect from DoS attacks (hackers sending huge data to crash your backend).

### 🧠 `app.use(express.static("public"))`

This allows your server to handle form submissions (like data from HTML forms or URL-encoded requests).

### 🧠 `app.use(cookieParser())`

This allows your backend to serve static files (like images, CSS, JS, PDFs, etc.) directly from the "public" folder.

*/
