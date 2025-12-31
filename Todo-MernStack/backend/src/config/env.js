import dotenv from "dotenv";
dotenv.config(); //“dotenv.config() loads environment variables from the .env file into process.env so they can be accessed safely within the application.”

export const env = {
  PORT: process.env.PORT || 8000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || "development",
};
