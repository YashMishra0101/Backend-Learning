import mongoose from "mongoose";
import { env } from "./config/env.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(env.MONGODB_URI);
    console.log(`MongoDB Connected, DB Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MongoDB Connection Failed: ", error);
    process.exit(1)
  }
};

export default connectDB;