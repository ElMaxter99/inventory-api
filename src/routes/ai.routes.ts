import { Router } from "express";
import { suggest } from "../controllers/ai.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router({ mergeParams: true });

router.post("/:itemId/ai/suggest", requireAuth, suggest);

export default router;
