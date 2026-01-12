import { Request, Response } from "express";
import * as service from "../services/inventory.service";
import Inventory from "../models/inventory.model";
import Zone from "../models/zone.model";
import Item from "../models/item.model";
import Locator from "../models/locator.model";
import { Types } from "mongoose";

export async function createInventory(req: Request, res: Response) {
  const userId = (req as any).user.sub;
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

export async function listInventories(req: Request, res: Response) {
  const userId = (req as any).user.sub;
  const page = Number((req.query as any).page || 1);
  const limit = Number((req.query as any).limit || 20);
  const { items, total } = await service.getUserInventories(
    new Types.ObjectId(userId),
    page,
    limit
  );
  res.json({
    data: items,
    error: null,
    meta: { page, limit, total },
  });
}

export async function getInventory(req: Request, res: Response) {
  res.json({ data: (req as any).inventory, error: null });
}

export async function updateInventory(req: Request, res: Response) {
  const inv = await Inventory.findByIdAndUpdate(
    (req as any).inventory._id,
    req.body,
    { new: true }
  );
  res.json({ data: inv, error: null });
}

export async function deleteInventory(req: Request, res: Response) {
  const inventoryId = (req as any).inventory._id;
  await Promise.all([
    Zone.deleteMany({ inventoryId }),
    Item.deleteMany({ inventoryId }),
    Locator.deleteMany({ inventoryId }),
    Inventory.findByIdAndDelete(inventoryId),
  ]);
  res.json({ data: true, error: null });
}

export async function enablePublic(req: Request, res: Response) {
  const inv = (req as any).inventory;
  const allowPublicEdit = !!req.body.allowPublicEdit;
  const result = await service.addPublicAccess(inv._id, allowPublicEdit);
  res.json({ data: { token: result.token }, error: null });
}

export async function disablePublic(req: Request, res: Response) {
  const inv = (req as any).inventory;
  await service.disablePublicAccess(inv._id);
  res.json({ data: true, error: null });
}

export async function updatePublicSettings(req: Request, res: Response) {
  const update: any = {};
  if (req.body.allowPublicEdit !== undefined) {
    update["publicAccess.allowPublicEdit"] = req.body.allowPublicEdit;
  }
  if (req.body.visibility !== undefined) {
    update.visibility = req.body.visibility;
  }
  const inv = await Inventory.findByIdAndUpdate(
    (req as any).inventory._id,
    update,
    { new: true }
  );
  res.json({
    data: { allowPublicEdit: inv?.publicAccess?.allowPublicEdit },
    error: null,
  });
}
