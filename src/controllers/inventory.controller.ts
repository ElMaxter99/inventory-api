import { Request, Response } from "express";
import * as service from "../services/inventory.service";
import Inventory from "../models/inventory.model";
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
  const list = await service.getUserInventories(new Types.ObjectId(userId));
  res.json({ data: list, error: null });
}

export async function getInventory(req: Request, res: Response) {
  res.json({ data: (req as any).inventory, error: null });
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
