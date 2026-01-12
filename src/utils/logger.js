const pino = require("pino");

const logger =
  process.env.LOG_PRETTY === "true"
    ? pino({
        transport: {
          target: "pino-pretty",
        },
      })
    : pino();

module.exports = logger;
