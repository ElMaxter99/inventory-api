import mongoose from "mongoose";
import config from "../config";
import User from "../models/user.model";
import Inventory from "../models/inventory.model";
import Zone from "../models/zone.model";
import Item from "../models/item.model";
import Locator from "../models/locator.model";
import bcrypt from "bcrypt";
import { randomToken } from "../utils/crypto";

async function seed() {
  await mongoose.connect(config.mongoUri);
  console.log("Connected to DB", config.mongoUri);

  await User.deleteMany({});
  await Inventory.deleteMany({});
  await Zone.deleteMany({});
  await Item.deleteMany({});
  await Locator.deleteMany({});

  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await User.create({
    email: "demo@example.com",
    passwordHash,
    name: "Demo User",
  });
  const inv = await Inventory.create({
    name: "Demo Home",
    description: "Seeded inventory",
    ownerUserId: user._id,
    members: [{ userId: user._id, role: "owner" }],
  });
  const zone = await Zone.create({
    inventoryId: inv._id,
    name: "Despacho Álvaro",
  });
  const item = await Item.create({
    inventoryId: inv._id,
    zoneId: zone._id,
    name: "Manga One Piece #1",
    type: "object",
    createdByUserId: user._id,
  });
  const locator = await Locator.create({
    inventoryId: inv._id,
    targetType: "item",
    targetId: item._id,
    token: randomToken(20),
    mode: "private",
    publicEdit: false,
  });

  console.log("Seed completed: ", {
    user: user.email,
    inventory: inv.name,
    zone: zone.name,
    item: item.name,
    locator: locator.token,
  });
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
