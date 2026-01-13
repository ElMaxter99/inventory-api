const mongoose = require("mongoose");
const config = require("../config");
const { logger } = require("../utils/logger");

async function connectMongoose() {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info("Connected to MongoDB");
  } catch (err) {
    logger.error("MongoDB connection error", err);
    throw err;
  }
}

module.exports = { connectMongoose, mongoose };
