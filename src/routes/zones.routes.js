const { Router } = require("express");
const {
  createZone,
  listZones,
  getZone,
  updateZone,
  deleteZone,
  reorderZones,
} = require("../controllers/zone.controller");
const {
  loadInventoryById,
  requireInventoryRole,
  loadZoneById,
} = require("../middlewares/loaders");
const { requireAuth } = require("../middlewares/auth");
const { validateBody } = require("../middlewares/validation");
const {
  createZoneSchema,
  updateZoneSchema,
  reorderZonesSchema,
} = require("../validators/zone.validator");

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

module.exports = router;
