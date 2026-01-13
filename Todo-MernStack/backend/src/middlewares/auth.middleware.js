import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    //Read token from Authorization header
    // Format: "Authorization: Bearer <token>"

/*
  Example of an actual request header
  const headers = {
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNjcwNDA5ODIyfQ.sflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
};
*/
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    //If token is missing → block access
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }
    //Verify JWT tokens
    const decoded = jwt.verify(token, env.JWT_SECRET);

    //Fetch user from database using decoded userId

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    //Attach user to request object

    req.user = user;

    //Allow request to proceed
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid token",
    });
  }
};
