// A specialized file dedicated only to connecting to MongoDB,  It uses mongoose.connect() to dial the number stored in .env, If it connects, it logs "MongoDB Connected"; if not, it kills the process to prevent a broken server from running.


import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // conn.connection.host tells us which DB host we connected to (useful for debugging)
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    // process.exit(1) stops the server immediately with a "failure" code.
    // There is no point in keeping the server running if it can't talk to the database.
    process.exit(1);
  }
};

export default connectDB;
