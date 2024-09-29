import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const connectionString =
      process.env.MONGO_CON_STRING;

    await mongoose.connect(connectionString);

    console.log("MongoDB Connected Successfully...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
