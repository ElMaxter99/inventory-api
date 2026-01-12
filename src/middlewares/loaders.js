const Inventory = require("../models/inventory.model");
const Zone = require("../models/zone.model");
const Item = require("../models/item.model");
const { getMemberRole, roleOrder } = require("../utils/permissions");

async function loadInventoryById(req, res, next) {
  const id = req.params.id;
  try {
    const inv = await Inventory.findById(id).lean();
    if (!inv)
      return res
        .status(404)
        .json({ data: null, error: { message: "Inventory not found" } });
    req.inventory = inv;
    next();
  } catch (err) {
    next(err);
  }
}

async function loadZoneById(req, res, next) {
  const zoneId = req.params.zoneId;
  const inventoryId = req.inventory?._id;
  try {
    const zone = await Zone.findOne({ _id: zoneId, inventoryId }).lean();
    if (!zone)
      return res
        .status(404)
        .json({ data: null, error: { message: "Zone not found" } });
    req.zone = zone;
    next();
  } catch (err) {
    next(err);
  }
}

async function loadItemById(req, res, next) {
  const itemId = req.params.itemId;
  const inventoryId = req.inventory?._id;
  try {
    const item = await Item.findOne({ _id: itemId, inventoryId }).lean();
    if (!item)
      return res
        .status(404)
        .json({ data: null, error: { message: "Item not found" } });
    req.item = item;
    next();
  } catch (err) {
    next(err);
  }
}

function requireInventoryRole(minRole) {
  return (req, res, next) => {
    const inv = req.inventory;
    const user = req.user;
    if (!inv)
      return res
        .status(500)
        .json({ data: null, error: { message: "Inventory not loaded" } });
    if (!user)
      return res
        .status(401)
        .json({ data: null, error: { message: "Unauthorized" } });
    const role = getMemberRole(inv, user.sub);
    if (!role)
      return res
        .status(403)
        .json({ data: null, error: { message: "Forbidden" } });
    if (roleOrder[role] < roleOrder[minRole])
      return res
        .status(403)
        .json({ data: null, error: { message: "Insufficient role" } });
    next();
  };
}

async function loadInventoryByToken(req, res, next) {
  const token = req.params.token;
  try {
    const inv = await Inventory.findOne({
      "publicAccess.token": token,
      "publicAccess.enabled": true,
    }).lean();
    if (!inv)
      return res
        .status(404)
        .json({ data: null, error: { message: "Inventory not found" } });
    req.inventory = inv;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  loadInventoryById,
  loadZoneById,
  loadItemById,
  requireInventoryRole,
  loadInventoryByToken,
};
