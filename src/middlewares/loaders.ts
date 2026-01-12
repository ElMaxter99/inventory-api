import { Request, Response, NextFunction } from "express";
import Inventory from "../models/inventory.model";

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

export function requireInventoryRole(
  minRole: "viewer" | "editor" | "admin" | "owner"
) {
  const order = { viewer: 0, editor: 1, admin: 2, owner: 3 } as any;
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
    const member = (inv.members || []).find(
      (m: any) => String(m.userId) === String(user.sub)
    );
    if (!member)
      return res
        .status(403)
        .json({ data: null, error: { message: "Forbidden" } });
    if (order[member.role] < order[minRole])
      return res
        .status(403)
        .json({ data: null, error: { message: "Insufficient role" } });
    next();
  };
}
