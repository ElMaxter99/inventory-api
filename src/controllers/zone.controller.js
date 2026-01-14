const Zone = require("../models/zone.model");
const Item = require("../models/item.model");
const Inventory = require("../models/inventory.model");
const { getMemberRole } = require("../utils/permissions");

async function createZone(req, res) {
  const inventoryId = req.inventory._id;
  const { name, description, order } = req.body;
  const zone = await Zone.create({ inventoryId, name, description, order });
  res.status(201).json({ data: zone, error: null });
}

async function listZones(req, res) {
  const inventoryId = req.inventory._id;
  const zones = await Zone.find({ inventoryId }).sort({ order: 1 });
  res.json({ data: zones, error: null });
}

async function getZone(req, res) {
  res.json({ data: req.zone, error: null });
}

async function updateZone(req, res) {
  const zone = await Zone.findByIdAndUpdate(req.zone._id, req.body, {
    new: true,
  });
  res.json({ data: zone, error: null });
}

async function deleteZone(req, res) {
  const zoneId = req.zone._id;
  await Item.deleteMany({ zoneId });
  await Zone.findByIdAndDelete(zoneId);
  res.json({ data: true, error: null });
}

async function reorderZones(req, res) {
  const inventoryId = req.inventory._id;
  const { zoneIds } = req.body;
  const updates = zoneIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id, inventoryId },
      update: { order: index },
    },
  }));
  if (updates.length > 0) {
    await Zone.bulkWrite(updates);
  }
  const zones = await Zone.find({ inventoryId }).sort({ order: 1 });
  res.json({ data: zones, error: null });
}

async function listUserZones(req, res) {
  const userId = req.user.sub;
  const inventories = await Inventory.find({ "members.userId": userId })
    .select("_id name description visibility ownerUserId publicAccess members")
    .lean();
  if (inventories.length === 0) {
    return res.json({ data: [], error: null, meta: { total: 0 } });
  }
  const inventoryIds = inventories.map((inv) => inv._id);
  const zones = await Zone.find({ inventoryId: { $in: inventoryIds } })
    .sort({ order: 1, createdAt: 1 })
    .lean();
  const inventoryById = new Map(
    inventories.map((inv) => [String(inv._id), inv])
  );
  const data = zones.map((zone) => {
    const inventory = inventoryById.get(String(zone.inventoryId));
    const role = inventory ? getMemberRole(inventory, userId) : null;
    return {
      ...zone,
      inventory: inventory
        ? {
            id: inventory._id,
            name: inventory.name,
            description: inventory.description,
            visibility: inventory.visibility,
            role,
            ownerUserId: inventory.ownerUserId,
            publicAccess: {
              enabled: inventory.publicAccess?.enabled,
              allowPublicEdit: inventory.publicAccess?.allowPublicEdit,
            },
          }
        : null,
    };
  });
  res.json({ data, error: null, meta: { total: data.length } });
}

module.exports = {
  createZone,
  listZones,
  getZone,
  updateZone,
  deleteZone,
  reorderZones,
  listUserZones,
};
