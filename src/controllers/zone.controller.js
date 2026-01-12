const Zone = require("../models/zone.model");
const Item = require("../models/item.model");

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

module.exports = {
  createZone,
  listZones,
  getZone,
  updateZone,
  deleteZone,
  reorderZones,
};
