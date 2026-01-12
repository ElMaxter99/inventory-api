const Item = require("../models/item.model");
const fs = require("fs/promises");
const path = require("path");
const config = require("../config");

async function uploadItemPhoto(req, res) {
  const itemId = req.item._id;
  const file = req.file;
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

async function deleteItemPhoto(req, res) {
  const itemId = req.item._id;
  const photoId = req.params.photoId;
  const item = await Item.findById(itemId);
  if (!item)
    return res
      .status(404)
      .json({ data: null, error: { message: "Item not found" } });
  const photo = item.photos.find(
    (p) => String(p._id) === String(photoId)
  );
  if (!photo)
    return res
      .status(404)
      .json({ data: null, error: { message: "Photo not found" } });
  item.photos = item.photos.filter(
    (p) => String(p._id) !== String(photoId)
  );
  await item.save();
  const filePath = path.resolve(process.cwd(), config.uploadDir, photo.filename);
  await fs.unlink(filePath).catch(() => null);
  res.json({ data: true, error: null });
}

module.exports = {
  uploadItemPhoto,
  deleteItemPhoto,
};
