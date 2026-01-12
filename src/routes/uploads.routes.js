const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const config = require("../config");
const {
  uploadItemPhoto,
  deleteItemPhoto,
} = require("../controllers/upload.controller");
const { requireAuth } = require("../middlewares/auth");
const {
  loadInventoryById,
  requireInventoryRole,
  loadItemById,
} = require("../middlewares/loaders");

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

module.exports = router;
