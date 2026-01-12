import Inventory from "../models/inventory.model";
import { randomToken } from "../utils/crypto";
import { Types } from "mongoose";

export async function createInventory(payload: any) {
  const inv = await Inventory.create(payload);
  return inv;
}

export async function addPublicAccess(
  inventoryId: Types.ObjectId,
  allowPublicEdit = false
) {
  const token = randomToken(24);
  const tokenHash = token; // we store plain in inventory.publicAccess.token (it's okay but ensure long random + index)
  const inv = await Inventory.findByIdAndUpdate(
    inventoryId,
    {
      visibility: "public",
      "publicAccess.enabled": true,
      "publicAccess.token": tokenHash,
      "publicAccess.allowPublicEdit": allowPublicEdit,
    },
    { new: true }
  );
  return { inv, token };
}

export async function disablePublicAccess(inventoryId: Types.ObjectId) {
  const inv = await Inventory.findByIdAndUpdate(
    inventoryId,
    {
      visibility: "private",
      "publicAccess.enabled": false,
      "publicAccess.token": null,
      "publicAccess.allowPublicEdit": false,
    },
    { new: true }
  );
  return inv;
}

export async function getUserInventories(
  userId: Types.ObjectId,
  page = 1,
  limit = 20
) {
  const query = { "members.userId": userId };
  const [items, total] = await Promise.all([
    Inventory.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Inventory.countDocuments(query),
  ]);
  return { items, total };
}
