const pino = require("pino");

const logger =
  process.env.NODE_ENV === "production"
    ? pino()
    : pino({
        transport: {
          target: "pino-pretty",
        },
      });

module.exports = logger;
