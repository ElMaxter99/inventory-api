const app = require("./app");
const config = require("./config");
const { connectMongoose } = require("./db/mongoose");
const logger = require("./utils/logger");

process.on("unhandledRejection", (reason) => {
  logger.error({ err: reason }, "Unhandled promise rejection");
});

process.on("uncaughtException", (err) => {
  logger.error({ err }, "Uncaught exception");
  process.exit(1);
});

async function main() {
  await connectMongoose();
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
