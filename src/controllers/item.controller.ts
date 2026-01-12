import { Request, Response } from "express";
import Item from "../models/item.model";
import Zone from "../models/zone.model";
import Locator from "../models/locator.model";
import Audit from "../models/audit.model";
import Inventory from "../models/inventory.model";
import { Types } from "mongoose";

export async function createItem(req: Request, res: Response) {
  const inventoryId = (req as any).inventory._id;
  const userId = (req as any).user?.sub;
  const {
    zoneId,
    parentItemId,
    type,
    name,
    description,
    quantity,
    tags,
    attributes,
  } = req.body;

  if (zoneId) {
    const zone = await Zone.findOne({ _id: zoneId, inventoryId });
    if (!zone)
      return res
        .status(404)
        .json({ data: null, error: { message: "Zone not found" } });
  }
  if (parentItemId) {
    const parent = await Item.findOne({ _id: parentItemId, inventoryId });
    if (!parent)
      return res
        .status(404)
        .json({ data: null, error: { message: "Parent item not found" } });
  }

  const item = await Item.create({
    inventoryId,
    zoneId,
    parentItemId,
    type,
    name,
    description,
    quantity,
    tags,
    attributes,
    createdByUserId: userId,
    updatedByUserId: userId,
  });
  res.status(201).json({ data: item, error: null });
}

export async function listItems(req: Request, res: Response) {
  const inventoryId = (req as any).inventory._id;
  const { zoneId, parentItemId, search, tags, page, limit, sort } =
    req.query as any;
  const query: any = { inventoryId };
  if (zoneId) query.zoneId = zoneId;
  if (parentItemId) query.parentItemId = parentItemId;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  if (tags) {
    const tagList = String(tags)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (tagList.length > 0) query.tags = { $in: tagList };
  }
  const pageNumber = Number(page || 1);
  const limitNumber = Number(limit || 20);
  const sortField = sort === "name" ? "name" : "createdAt";

  const [items, total] = await Promise.all([
    Item.find(query)
      .sort({ [sortField]: 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber),
    Item.countDocuments(query),
  ]);
  res.json({
    data: items,
    error: null,
    meta: { page: pageNumber, limit: limitNumber, total },
  });
}

export async function getItem(req: Request, res: Response) {
  const item = await Item.findById((req as any).item._id).lean();
  if (!item)
    return res
      .status(404)
      .json({ data: null, error: { message: "Item not found" } });
  let children: any[] = [];
  if (item.type === "container") {
    children = await Item.find({ parentItemId: item._id });
  }
  res.json({ data: { ...item, children }, error: null });
}

export async function updateItem(req: Request, res: Response) {
  const userId = (req as any).user?.sub;
  const inventoryId = (req as any).inventory._id;
  if (req.body.zoneId) {
    const zone = await Zone.findOne({ _id: req.body.zoneId, inventoryId });
    if (!zone)
      return res
        .status(404)
        .json({ data: null, error: { message: "Zone not found" } });
  }
  if (req.body.parentItemId) {
    const parent = await Item.findOne({
      _id: req.body.parentItemId,
      inventoryId,
    });
    if (!parent)
      return res
        .status(404)
        .json({ data: null, error: { message: "Parent item not found" } });
  }
  const update = { ...req.body, updatedByUserId: userId, updatedByPublic: false };
  const item = await Item.findOneAndUpdate(
    { _id: (req as any).item._id, inventoryId },
    update,
    { new: true }
  );
  res.json({ data: item, error: null });
}

export async function deleteItem(req: Request, res: Response) {
  const itemId = (req as any).item._id;
  const cascade = String((req.query as any).cascade || "false") === "true";
  const children = await Item.find({ parentItemId: itemId }).select("_id");
  if (children.length > 0 && !cascade) {
    return res.status(409).json({
      data: null,
      error: { message: "Item has children. Use cascade=true to delete." },
    });
  }
  if (children.length > 0) {
    await Item.deleteMany({ parentItemId: itemId });
  }
  await Item.findByIdAndDelete(itemId);
  res.json({ data: true, error: null });
}

export async function addComment(req: Request, res: Response) {
  const itemId = (req as any).item._id;
  const userId = (req as any).user?.sub;
  const comment = { userId, text: req.body.text, createdAt: new Date() };
  const item = await Item.findByIdAndUpdate(
    itemId,
    { $push: { comments: comment } },
    { new: true }
  );
  res.status(201).json({ data: item?.comments?.slice(-1)[0], error: null });
}

export async function deleteComment(req: Request, res: Response) {
  const { commentId } = req.params as any;
  const itemId = (req as any).item._id;
  const item = await Item.findById(itemId);
  if (!item)
    return res
      .status(404)
      .json({ data: null, error: { message: "Item not found" } });
  item.comments = item.comments.filter(
    (comment: any) => String(comment._id) !== String(commentId)
  );
  await item.save();
  res.json({ data: true, error: null });
}

export async function publicUpdateItem(req: Request, res: Response) {
  const token = req.params.token;
  const locator = await Locator.findOne({ token });
  if (!locator)
    return res
      .status(404)
      .json({ data: null, error: { message: "Locator not found" } });
  if (locator.mode !== "public" || !locator.publicEdit) {
    return res
      .status(403)
      .json({ data: null, error: { message: "Public edit disabled" } });
  }
  const inventory = await Inventory.findById(locator.inventoryId).lean();
  if (!inventory?.publicAccess?.enabled || !inventory.publicAccess.allowPublicEdit) {
    return res.status(403).json({
      data: null,
      error: { message: "Inventory public edit disabled" },
    });
  }
  let itemId: Types.ObjectId | null = null;
  if (locator.targetType === "item") {
    itemId = locator.targetId as Types.ObjectId;
  } else if (locator.targetType === "inventory") {
    if (!req.body.itemId)
      return res.status(400).json({
        data: null,
        error: { message: "itemId required for inventory locator" },
      });
    itemId = new Types.ObjectId(req.body.itemId);
  }
  if (!itemId)
    return res
      .status(400)
      .json({ data: null, error: { message: "Invalid locator target" } });

  const { name, description, quantity, tags, attributes } = req.body;
  const update = {
    name,
    description,
    quantity,
    tags,
    attributes,
    updatedByUserId: null,
    updatedByPublic: true,
    updatedByActor: "public",
  };
  Object.keys(update).forEach((key) => {
    if (update[key as keyof typeof update] === undefined) {
      delete update[key as keyof typeof update];
    }
  });
  const item = await Item.findOneAndUpdate(
    { _id: itemId, inventoryId: locator.inventoryId },
    update,
    { new: true }
  );
  if (!item)
    return res
      .status(404)
      .json({ data: null, error: { message: "Item not found" } });
  await Audit.create({
    action: "public_update",
    entity: "item",
    entityId: item._id,
    actor: { type: "public", token },
    diff: update,
  });
  res.json({ data: item, error: null });
}
