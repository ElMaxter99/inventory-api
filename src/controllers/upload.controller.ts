import { Request, Response } from "express";
import Item from "../models/item.model";
import fs from "fs/promises";
import path from "path";
import config from "../config";

export async function uploadItemPhoto(req: Request, res: Response) {
  const itemId = (req as any).item._id;
  const file = (req as any).file;
  if (!file)
    return res
      .status(400)
      .json({ data: null, error: { message: "File required" } });
  const photo = {
    url: `/uploads/${file.filename}`,
    filename: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    createdAt: new Date(),
  };
  const item = await Item.findByIdAndUpdate(
    itemId,
    { $push: { photos: photo } },
    { new: true }
  );
  res.status(201).json({ data: item?.photos?.slice(-1)[0], error: null });
}

export async function deleteItemPhoto(req: Request, res: Response) {
  const itemId = (req as any).item._id;
  const photoId = req.params.photoId;
  const item = await Item.findById(itemId);
  if (!item)
    return res
      .status(404)
      .json({ data: null, error: { message: "Item not found" } });
  const photo = item.photos.find(
    (p: any) => String(p._id) === String(photoId)
  );
  if (!photo)
    return res
      .status(404)
      .json({ data: null, error: { message: "Photo not found" } });
  item.photos = item.photos.filter(
    (p: any) => String(p._id) !== String(photoId)
  );
  await item.save();
  const filePath = path.resolve(process.cwd(), config.uploadDir, photo.filename);
  await fs.unlink(filePath).catch(() => null);
  res.json({ data: true, error: null });
}
