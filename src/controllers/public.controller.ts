import { Request, Response } from "express";
import Inventory from "../models/inventory.model";

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
  // minimal zones summary
  res.json({
    data: { id: inv._id, name: inv.name, description: inv.description },
    error: null,
  });
}
