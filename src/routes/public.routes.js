const { Router } = require("express");
const {
  publicInventoryByToken,
  publicLocatorByToken,
} = require("../controllers/public.controller");
const { publicUpdateItem } = require("../controllers/item.controller");
const { rateLimitPublicEndpoints } = require("../middlewares/publicAccess");
const { validateBody } = require("../middlewares/validation");
const { publicItemUpdateSchema } = require("../validators/item.validator");

const router = Router();

router.get(
  "/inventories/:token",
  rateLimitPublicEndpoints,
  publicInventoryByToken
);
router.get("/locators/:token", rateLimitPublicEndpoints, publicLocatorByToken);
router.patch(
  "/items/:token",
  rateLimitPublicEndpoints,
  validateBody(publicItemUpdateSchema),
  publicUpdateItem
);

module.exports = router;
