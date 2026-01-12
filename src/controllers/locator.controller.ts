import { Request, Response } from "express";
import Locator from "../models/locator.model";
import Inventory from "../models/inventory.model";
import Zone from "../models/zone.model";
import Item from "../models/item.model";
import { randomToken } from "../utils/crypto";
import { getMemberRole } from "../utils/permissions";

export async function resolveLocator(req: Request, res: Response) {
  const token = req.params.token;
  const locator = await Locator.findOne({ token }).lean();
  if (!locator)
    return res
      .status(404)
      .json({ data: null, error: { message: "Locator not found" } });
  const inv = await Inventory.findById(locator.inventoryId).lean();
  const userId = (req as any).user?.sub;
  if (locator.mode === "private") {
    const role = getMemberRole(inv, userId);
    if (!role) {
      return res
        .status(403)
        .json({ data: null, error: { message: "Forbidden" } });
    }
  }
  let target: any = null;
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

export async function createLocator(req: Request, res: Response) {
  const inventoryId = (req as any).inventory._id;
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

export async function updateLocator(req: Request, res: Response) {
  const locatorId = req.params.locatorId;
  const locator = await Locator.findOneAndUpdate(
    { _id: locatorId, inventoryId: (req as any).inventory._id },
    req.body,
    { new: true }
  );
  res.json({ data: locator, error: null });
}

export async function deleteLocator(req: Request, res: Response) {
  const locatorId = req.params.locatorId;
  await Locator.findOneAndDelete({
    _id: locatorId,
    inventoryId: (req as any).inventory._id,
  });
  res.json({ data: true, error: null });
}
