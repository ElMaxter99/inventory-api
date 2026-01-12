const { Router } = require("express");
const {
  createLocator,
  updateLocator,
  deleteLocator,
} = require("../controllers/locator.controller");
const { requireAuth } = require("../middlewares/auth");
const { loadInventoryById, requireInventoryRole } = require("../middlewares/loaders");
const { validateBody } = require("../middlewares/validation");
const {
  createLocatorSchema,
  updateLocatorSchema,
} = require("../validators/locator.validator");

const router = Router({ mergeParams: true });

router.post(
  "/",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("admin"),
  validateBody(createLocatorSchema),
  createLocator
);
router.patch(
  "/:locatorId",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("admin"),
  validateBody(updateLocatorSchema),
  updateLocator
);
router.delete(
  "/:locatorId",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("admin"),
  deleteLocator
);

module.exports = router;
