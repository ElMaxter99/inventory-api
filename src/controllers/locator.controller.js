const Locator = require("../models/locator.model");
const Inventory = require("../models/inventory.model");
const Zone = require("../models/zone.model");
const Item = require("../models/item.model");
const { randomToken } = require("../utils/crypto");
const { getMemberRole } = require("../utils/permissions");

async function resolveLocator(req, res) {
  const token = req.params.token;
  const locator = await Locator.findOne({ token }).lean();
  if (!locator)
    return res
      .status(404)
      .json({ data: null, error: { message: "Locator not found" } });
  const inv = await Inventory.findById(locator.inventoryId).lean();
  const userId = req.user?.sub;
  if (locator.mode === "private") {
    const role = getMemberRole(inv, userId);
    if (!role) {
      return res
        .status(403)
        .json({ data: null, error: { message: "Forbidden" } });
    }
  }
  let target = null;
  if (locator.targetType === "inventory") target = inv;
  if (locator.targetType === "zone")
    target = await Zone.findById(locator.targetId).lean();
  if (locator.targetType === "item")
    target = await Item.findById(locator.targetId).lean();
  return res.json({
    data: {
      locator: {
        token: locator.token,
        mode: locator.mode,
        publicEdit: locator.publicEdit,
      },
      target,
    },
    error: null,
  });
}

async function createLocator(req, res) {
  const inventoryId = req.inventory._id;
  const { targetType, targetId, mode, publicEdit } = req.body;
  if (targetType === "inventory") {
    if (String(targetId) !== String(inventoryId)) {
      return res.status(400).json({
        data: null,
        error: { message: "targetId must match inventory id" },
      });
    }
  }
  if (targetType === "zone") {
    const zone = await Zone.findOne({ _id: targetId, inventoryId });
    if (!zone)
      return res
        .status(404)
        .json({ data: null, error: { message: "Zone not found" } });
  }
  if (targetType === "item") {
    const item = await Item.findOne({ _id: targetId, inventoryId });
    if (!item)
      return res
        .status(404)
        .json({ data: null, error: { message: "Item not found" } });
  }
  const token = randomToken(24);
  const locator = await Locator.create({
    inventoryId,
    targetType,
    targetId,
    token,
    mode,
    publicEdit: !!publicEdit,
  });
  res.status(201).json({
    data: { id: locator._id, token: locator.token },
    error: null,
  });
}

async function updateLocator(req, res) {
  const locatorId = req.params.locatorId;
  const locator = await Locator.findOneAndUpdate(
    { _id: locatorId, inventoryId: req.inventory._id },
    req.body,
    { new: true }
  );
  res.json({ data: locator, error: null });
}

async function deleteLocator(req, res) {
  const locatorId = req.params.locatorId;
  await Locator.findOneAndDelete({
    _id: locatorId,
    inventoryId: req.inventory._id,
  });
  res.json({ data: true, error: null });
}

module.exports = {
  resolveLocator,
  createLocator,
  updateLocator,
  deleteLocator,
};
