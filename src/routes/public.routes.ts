import { Router } from "express";
import {
  publicInventoryByToken,
  publicLocatorByToken,
} from "../controllers/public.controller";
import { publicUpdateItem } from "../controllers/item.controller";
import { rateLimitPublicEndpoints } from "../middlewares/publicAccess";
import { validateBody } from "../middlewares/validation";
import { publicItemUpdateSchema } from "../validators/item.validator";

const router = Router();

router.get(
  "/inventories/:token",
  rateLimitPublicEndpoints,
  publicInventoryByToken
);
router.get(
  "/locators/:token",
  rateLimitPublicEndpoints,
  publicLocatorByToken
);
router.patch(
  "/items/:token",
  rateLimitPublicEndpoints,
  validateBody(publicItemUpdateSchema),
  publicUpdateItem
);

export default router;
