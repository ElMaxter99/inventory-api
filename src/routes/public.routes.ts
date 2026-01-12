import { Router } from "express";
import { publicInventoryByToken } from "../controllers/public.controller";

const router = Router();

router.get("/inventories/:token", publicInventoryByToken);

export default router;
