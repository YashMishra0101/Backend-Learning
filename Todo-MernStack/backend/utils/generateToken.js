import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, //payload
    process.env.JWT_SECRET, //secret key
    { expiresIn: process.env.JWT_EXPIRE } //expiry
  );
};
