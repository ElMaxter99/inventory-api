import { Router } from "express";
import {
  createLocator,
  updateLocator,
  deleteLocator,
} from "../controllers/locator.controller";
import { requireAuth } from "../middlewares/auth";
import { loadInventoryById, requireInventoryRole } from "../middlewares/loaders";
import { validateBody } from "../middlewares/validation";
import {
  createLocatorSchema,
  updateLocatorSchema,
} from "../validators/locator.validator";

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

export default router;
