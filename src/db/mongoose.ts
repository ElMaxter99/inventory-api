import mongoose from "mongoose";
import config from "../config";
import logger from "../utils/logger";

export async function connectMongoose() {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info("Connected to MongoDB");
  } catch (err) {
    logger.error("MongoDB connection error", err);
    throw err;
  }
}

export default mongoose;
