import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "15min" });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "30d" });
};
