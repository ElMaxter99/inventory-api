import { Router } from "express";
import {
  createInventory,
  listInventories,
  getInventory,
  updateInventory,
  deleteInventory,
  enablePublic,
  disablePublic,
  updatePublicSettings,
} from "../controllers/inventory.controller";
import { requireAuth } from "../middlewares/auth";
import { validateBody } from "../middlewares/validation";
import {
  createInventorySchema,
  updateInventorySchema,
  publicAccessSchema,
} from "../validators/inventory.validator";
import {
  loadInventoryById,
  requireInventoryRole,
} from "../middlewares/loaders";

import aiRoutes from "./ai.routes";
import zonesRoutes from "./zones.routes";
import itemsRoutes from "./items.routes";
import membersRoutes from "./members.routes";
import locatorRoutes from "./inventory-locators.routes";
import uploadsRoutes from "./uploads.routes";

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
router.patch(
  "/:id",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("admin"),
  validateBody(updateInventorySchema),
  updateInventory
);
router.delete(
  "/:id",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("owner"),
  deleteInventory
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
router.patch(
  "/:id/public",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("owner"),
  validateBody(publicAccessSchema),
  updatePublicSettings
);

router.use("/:id/members", membersRoutes);
router.use("/:id/zones", zonesRoutes);
router.use("/:id/items", itemsRoutes);
router.use("/:id/items", uploadsRoutes);
router.use("/:id/locators", locatorRoutes);

// AI route example mounted under inventories
router.use("/:id/items", aiRoutes);

export default router;
