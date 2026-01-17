//db.js is responsible for connecting the application to MongoDB and keeping the database logic separate.
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

/*
mongoose.connect() returns a Mongoose object, not a string. Logging the entire object would result in [object Object]. Accessing connection.host allows us to log meaningful connection details like the database host for debugging and confirmation purposes.

--console.log(`MongoDB Connected: ${connectionInstance}`);

Output: MongoDB Connected: [object Object] ->Completely useless for understanding

--console.log(`MongoDB Connected, DB Host: ${connectionInstance.connection.host}`;

Output: MongoDB Connected, DB Host: cluster0-shard-00-01.mongodb.net ->Readable,Useful for debugging,Professional logging 





*/