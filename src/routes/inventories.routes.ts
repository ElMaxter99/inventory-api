import { Router } from "express";
import {
  createInventory,
  listInventories,
  getInventory,
  enablePublic,
  disablePublic,
} from "../controllers/inventory.controller";
import { requireAuth } from "../middlewares/auth";
import { validateBody } from "../middlewares/validation";
import { createInventorySchema } from "../validators/inventory.validator";
import {
  loadInventoryById,
  requireInventoryRole,
} from "../middlewares/loaders";

import aiRoutes from "./ai.routes";

const router = Router({ mergeParams: true });

router.post(
  "/",
  requireAuth,
  validateBody(createInventorySchema),
  createInventory
);
router.get("/", requireAuth, listInventories);
router.get(
  "/:id",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("viewer"),
  getInventory
);
router.post(
  "/:id/public/enable",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("owner"),
  enablePublic
);
router.post(
  "/:id/public/disable",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("owner"),
  disablePublic
);

// AI route example mounted under inventories
router.use("/:id/items", aiRoutes);

export default router;
