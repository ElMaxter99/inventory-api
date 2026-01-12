import { Router } from "express";
import { resolveLocator } from "../controllers/locator.controller";
import { optionalAuth } from "../middlewares/auth";
import { rateLimitPublicEndpoints } from "../middlewares/publicAccess";

const router = Router();

router.get("/:token", rateLimitPublicEndpoints, optionalAuth, resolveLocator);

export default router;
