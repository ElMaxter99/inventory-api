import { Router } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import config from "../config";
import { uploadItemPhoto, deleteItemPhoto } from "../controllers/upload.controller";
import { requireAuth } from "../middlewares/auth";
import {
  loadInventoryById,
  requireInventoryRole,
  loadItemById,
} from "../middlewares/loaders";

const storage = multer.diskStorage({
  destination: path.resolve(process.cwd(), config.uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${crypto.randomUUID()}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });
const router = Router({ mergeParams: true });

router.post(
  "/:itemId/photos",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("editor"),
  loadItemById,
  upload.single("photo"),
  uploadItemPhoto
);
router.delete(
  "/:itemId/photos/:photoId",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("editor"),
  loadItemById,
  deleteItemPhoto
);

export default router;
