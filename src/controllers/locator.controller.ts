import { Request, Response } from "express";
import Locator from "../models/locator.model";
import Inventory from "../models/inventory.model";
import Zone from "../models/zone.model";
import Item from "../models/item.model";

export async function resolveLocator(req: Request, res: Response) {
  const token = req.params.token;
  const locator = await Locator.findOne({ token }).lean();
  if (!locator)
    return res
      .status(404)
      .json({ data: null, error: { message: "Locator not found" } });
  const inv = await Inventory.findById(locator.inventoryId).lean();
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
