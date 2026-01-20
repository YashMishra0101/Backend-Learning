import { User } from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { RefreshToken } from "../models/refreshToken.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    next(error); //If a middleware function has 4 parameters, Express treats it as an error-handling middleware.
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const accessToken = generateAccessToken({
      userId: user._id,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id,
    });

    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Set refresh token as HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // Works on HTTP (set true for HTTPS/production)
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        name: user.name
      },
    });
  } catch (error) {
    next(error); //If a middleware function has 4 parameters, Express treats it as an error-handling middleware.
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }
    const decoded = jwt.verify(refreshToken, env.JWT_SECRET);

    const newAccessToken = generateAccessToken({
      userId: decoded.userId,//If valid, it extracts the data hidden inside the token, specifically the userId. This is like checking a fake ID card to see if the name inside is real.
    });
    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    await RefreshToken.deleteOne({ token: refreshToken });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // Works on HTTP (set true for HTTPS/production)
      sameSite: "lax",
    })

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
