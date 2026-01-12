const Inventory = require("../models/inventory.model");
const { randomToken } = require("../utils/crypto");

async function createInventory(payload) {
  const inv = await Inventory.create(payload);
  return inv;
}

async function addPublicAccess(inventoryId, allowPublicEdit = false) {
  const token = randomToken(24);
  const tokenHash = token; // we store plain in inventory.publicAccess.token (it's okay but ensure long random + index)
  const inv = await Inventory.findByIdAndUpdate(
    inventoryId,
    {
      visibility: "public",
      "publicAccess.enabled": true,
      "publicAccess.token": tokenHash,
      "publicAccess.allowPublicEdit": allowPublicEdit,
    },
    { new: true }
  );
  return { inv, token };
}

async function disablePublicAccess(inventoryId) {
  const inv = await Inventory.findByIdAndUpdate(
    inventoryId,
    {
      visibility: "private",
      "publicAccess.enabled": false,
      "publicAccess.token": null,
      "publicAccess.allowPublicEdit": false,
    },
    { new: true }
  );
  return inv;
}

async function getUserInventories(userId, page = 1, limit = 20) {
  const query = { "members.userId": userId };
  const [items, total] = await Promise.all([
    Inventory.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Inventory.countDocuments(query),
  ]);
  return { items, total };
}

module.exports = {
  createInventory,
  addPublicAccess,
  disablePublicAccess,
  getUserInventories,
};
