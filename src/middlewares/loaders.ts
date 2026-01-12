import { Request, Response, NextFunction } from "express";
import Inventory from "../models/inventory.model";
import Zone from "../models/zone.model";
import Item from "../models/item.model";
import { getMemberRole, roleOrder } from "../utils/permissions";

export async function loadInventoryById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = (req.params as any).id;
  try {
    const inv = await Inventory.findById(id).lean();
    if (!inv)
      return res
        .status(404)
        .json({ data: null, error: { message: "Inventory not found" } });
    (req as any).inventory = inv;
    next();
  } catch (err) {
    next(err);
  }
}

export async function loadZoneById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const zoneId = (req.params as any).zoneId;
  const inventoryId = (req as any).inventory?._id;
  try {
    const zone = await Zone.findOne({ _id: zoneId, inventoryId }).lean();
    if (!zone)
      return res
        .status(404)
        .json({ data: null, error: { message: "Zone not found" } });
    (req as any).zone = zone;
    next();
  } catch (err) {
    next(err);
  }
}

export async function loadItemById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const itemId = (req.params as any).itemId;
  const inventoryId = (req as any).inventory?._id;
  try {
    const item = await Item.findOne({ _id: itemId, inventoryId }).lean();
    if (!item)
      return res
        .status(404)
        .json({ data: null, error: { message: "Item not found" } });
    (req as any).item = item;
    next();
  } catch (err) {
    next(err);
  }
}

export function requireInventoryRole(
  minRole: "viewer" | "editor" | "admin" | "owner"
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const inv = (req as any).inventory;
    const user = (req as any).user;
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

export async function loadInventoryByToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = (req.params as any).token;
  try {
    const inv = await Inventory.findOne({
      "publicAccess.token": token,
      "publicAccess.enabled": true,
    }).lean();
    if (!inv)
      return res
        .status(404)
        .json({ data: null, error: { message: "Inventory not found" } });
    (req as any).inventory = inv;
    next();
  } catch (err) {
    next(err);
  }
}
