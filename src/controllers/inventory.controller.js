const service = require("../services/inventory.service");
const Inventory = require("../models/inventory.model");
const Zone = require("../models/zone.model");
const Item = require("../models/item.model");
const Locator = require("../models/locator.model");

async function createInventory(req, res) {
  const userId = req.user.sub;
  const { name, description, visibility } = req.body;
  const inv = await service.createInventory({
    name,
    description,
    visibility,
    ownerUserId: userId,
    members: [{ userId, role: "owner" }],
  });
  res.status(201).json({ data: inv, error: null });
}

async function listInventories(req, res) {
  const userId = req.user.sub;
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const { items, total } = await service.getUserInventories(
    userId,
    page,
    limit
  );
  res.json({
    data: items,
    error: null,
    meta: { page, limit, total },
  });
}

async function getInventory(req, res) {
  res.json({ data: req.inventory, error: null });
}

async function updateInventory(req, res) {
  const inv = await Inventory.findByIdAndUpdate(
    req.inventory._id,
    req.body,
    { new: true }
  );
  res.json({ data: inv, error: null });
}

async function deleteInventory(req, res) {
  const inventoryId = req.inventory._id;
  await Promise.all([
    Zone.deleteMany({ inventoryId }),
    Item.deleteMany({ inventoryId }),
    Locator.deleteMany({ inventoryId }),
    Inventory.findByIdAndDelete(inventoryId),
  ]);
  res.json({ data: true, error: null });
}

async function enablePublic(req, res) {
  const inv = req.inventory;
  const allowPublicEdit = !!req.body.allowPublicEdit;
  const result = await service.addPublicAccess(inv._id, allowPublicEdit);
  res.json({ data: { token: result.token }, error: null });
}

async function disablePublic(req, res) {
  const inv = req.inventory;
  await service.disablePublicAccess(inv._id);
  res.json({ data: true, error: null });
}

async function updatePublicSettings(req, res) {
  const update = {};
  if (req.body.allowPublicEdit !== undefined) {
    update["publicAccess.allowPublicEdit"] = req.body.allowPublicEdit;
  }
  if (req.body.visibility !== undefined) {
    update.visibility = req.body.visibility;
  }
  const inv = await Inventory.findByIdAndUpdate(req.inventory._id, update, {
    new: true,
  });
  res.json({
    data: { allowPublicEdit: inv?.publicAccess?.allowPublicEdit },
    error: null,
  });
}

module.exports = {
  createInventory,
  listInventories,
  getInventory,
  updateInventory,
  deleteInventory,
  enablePublic,
  disablePublic,
  updatePublicSettings,
};
