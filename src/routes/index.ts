import { Router } from "express";
import auth from "./auth.routes";
import inventories from "./inventories.routes";
import locators from "./locators.routes";
import publicRoutes from "./public.routes";

export const router = Router();

router.use("/auth", auth);
router.use("/inventories", inventories);
router.use("/locators", locators);
router.use("/public", publicRoutes);

export default { router };
