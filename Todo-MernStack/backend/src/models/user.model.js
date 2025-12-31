import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false, // 👈 never return password by default, password never leaks accidentally
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User",userSchema);
