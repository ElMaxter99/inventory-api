const app = require("./app");
const config = require("./config");
const { connectMongoose } = require("./db/mongoose");

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
