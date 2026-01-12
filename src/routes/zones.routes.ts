import { Router } from "express";
import {
  createZone,
  listZones,
  getZone,
  updateZone,
  deleteZone,
  reorderZones,
} from "../controllers/zone.controller";
import {
  loadInventoryById,
  requireInventoryRole,
  loadZoneById,
} from "../middlewares/loaders";
import { requireAuth } from "../middlewares/auth";
import { validateBody } from "../middlewares/validation";
import {
  createZoneSchema,
  updateZoneSchema,
  reorderZonesSchema,
} from "../validators/zone.validator";

const router = Router({ mergeParams: true });

router.post(
  "/",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("editor"),
  validateBody(createZoneSchema),
  createZone
);
router.get(
  "/",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("viewer"),
  listZones
);
router.get(
  "/:zoneId",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("viewer"),
  loadZoneById,
  getZone
);
router.patch(
  "/:zoneId",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("editor"),
  loadZoneById,
  validateBody(updateZoneSchema),
  updateZone
);
router.delete(
  "/:zoneId",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("admin"),
  loadZoneById,
  deleteZone
);
router.patch(
  "/reorder",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("editor"),
  validateBody(reorderZonesSchema),
  reorderZones
);

export default router;
