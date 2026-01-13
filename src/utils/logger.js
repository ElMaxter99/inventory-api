const fs = require("fs");
const path = require("path");
const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const config = require("../config");

const devFormat = format.combine(format.colorize(), format.simple());
const prodFormat = format.combine(format.timestamp(), format.json());

const transportsList = [new transports.Console()];

if (!config.isDevelopment) {
  const logDirectory = path.resolve(__dirname, "..", "..", "logs");
  fs.mkdirSync(logDirectory, { recursive: true });

  transportsList.push(
    new DailyRotateFile({
      filename: path.join(logDirectory, "api-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    })
  );
}

const logger = createLogger({
  level: config.isDevelopment ? "debug" : "info",
  format: config.isDevelopment ? devFormat : prodFormat,
  transports: transportsList,
});

const stream = {
  write(message) {
    logger.info(message.trim());
  },
};

module.exports = {
  logger,
  stream,
};
