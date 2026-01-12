import { Router } from "express";
import { suggest } from "../controllers/ai.controller";
import { requireAuth } from "../middlewares/auth";
import {
  loadInventoryById,
  requireInventoryRole,
  loadItemById,
} from "../middlewares/loaders";

const router = Router({ mergeParams: true });

router.post(
  "/:itemId/ai/suggest",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("editor"),
  loadItemById,
  suggest
);

export default router;
