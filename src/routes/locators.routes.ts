import { Router } from "express";
import { resolveLocator } from "../controllers/locator.controller";

const router = Router();

router.get("/:token", resolveLocator);

export default router;
