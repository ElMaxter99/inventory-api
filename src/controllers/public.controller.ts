import { Request, Response } from "express";
import Inventory from "../models/inventory.model";
import Locator from "../models/locator.model";
import Zone from "../models/zone.model";

export async function publicInventoryByToken(req: Request, res: Response) {
  const token = req.params.token;
  const inv = await Inventory.findOne({
    "publicAccess.token": token,
    "publicAccess.enabled": true,
  }).lean();
  if (!inv)
    return res
      .status(404)
      .json({ data: null, error: { message: "Not found" } });
  const zones = await Zone.find({ inventoryId: inv._id })
    .sort({ order: 1 })
    .select("_id name description order")
    .lean();
  res.json({
    data: {
      id: inv._id,
      name: inv.name,
      description: inv.description,
      zones,
    },
    error: null,
  });
}

export async function publicLocatorByToken(req: Request, res: Response) {
  const token = req.params.token;
  const locator = await Locator.findOne({ token }).lean();
  if (!locator)
    return res
      .status(404)
      .json({ data: null, error: { message: "Locator not found" } });
  if (locator.mode !== "public") {
    return res
      .status(403)
      .json({ data: null, error: { message: "Locator is private" } });
  }
  res.json({
    data: {
      token: locator.token,
      targetType: locator.targetType,
      targetId: locator.targetId,
    },
    error: null,
  });
}
