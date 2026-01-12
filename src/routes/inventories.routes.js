const { Router } = require("express");
const {
  createInventory,
  listInventories,
  getInventory,
  updateInventory,
  deleteInventory,
  enablePublic,
  disablePublic,
  updatePublicSettings,
} = require("../controllers/inventory.controller");
const { requireAuth } = require("../middlewares/auth");
const { validateBody } = require("../middlewares/validation");
const {
  createInventorySchema,
  updateInventorySchema,
  publicAccessSchema,
} = require("../validators/inventory.validator");
const {
  loadInventoryById,
  requireInventoryRole,
} = require("../middlewares/loaders");

const aiRoutes = require("./ai.routes");
const zonesRoutes = require("./zones.routes");
const itemsRoutes = require("./items.routes");
const membersRoutes = require("./members.routes");
const locatorRoutes = require("./inventory-locators.routes");
const uploadsRoutes = require("./uploads.routes");

const router = Router({ mergeParams: true });

router.post("/", requireAuth, validateBody(createInventorySchema), createInventory);
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

router.use("/:id/items", aiRoutes);

module.exports = router;
