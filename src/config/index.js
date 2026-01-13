const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const nodeEnv = process.env.NODE_ENV || "development";

module.exports = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  nodeEnv,
  isDevelopment: nodeEnv === "development",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/inventory-api",
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "access-secret",
    accessExpires: process.env.JWT_ACCESS_EXPIRES || "15m",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "refresh-secret",
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || "7d",
  },
  corsOrigin: process.env.CORS_ORIGIN || "*",
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  aiProvider: process.env.AI_PROVIDER || "dummy",
};
