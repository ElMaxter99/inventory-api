const { Router } = require("express");
const { resolveLocator } = require("../controllers/locator.controller");
const { optionalAuth } = require("../middlewares/auth");
const { rateLimitPublicEndpoints } = require("../middlewares/publicAccess");

const router = Router();

router.get("/:token", rateLimitPublicEndpoints, optionalAuth, resolveLocator);

module.exports = router;
