import app from './app';
import config from './config';
import { connectMongoose } from './db/mongoose';

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
