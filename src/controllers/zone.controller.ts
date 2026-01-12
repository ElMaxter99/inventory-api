import { Request, Response } from "express";
import Zone from "../models/zone.model";
import Item from "../models/item.model";

export async function createZone(req: Request, res: Response) {
  const inventoryId = (req as any).inventory._id;
  const { name, description, order } = req.body;
  const zone = await Zone.create({ inventoryId, name, description, order });
  res.status(201).json({ data: zone, error: null });
}

export async function listZones(req: Request, res: Response) {
  const inventoryId = (req as any).inventory._id;
  const zones = await Zone.find({ inventoryId }).sort({ order: 1 });
  res.json({ data: zones, error: null });
}

export async function getZone(req: Request, res: Response) {
  res.json({ data: (req as any).zone, error: null });
}

export async function updateZone(req: Request, res: Response) {
  const zone = await Zone.findByIdAndUpdate(
    (req as any).zone._id,
    req.body,
    { new: true }
  );
  res.json({ data: zone, error: null });
}

export async function deleteZone(req: Request, res: Response) {
  const zoneId = (req as any).zone._id;
  await Item.deleteMany({ zoneId });
  await Zone.findByIdAndDelete(zoneId);
  res.json({ data: true, error: null });
}

export async function reorderZones(req: Request, res: Response) {
  const inventoryId = (req as any).inventory._id;
  const { zoneIds } = req.body;
  const updates = zoneIds.map((id: string, index: number) => ({
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
