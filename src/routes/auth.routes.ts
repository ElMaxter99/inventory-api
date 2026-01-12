import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  me,
} from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validation";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
import { refreshSchema } from "../validators/token.validator";

router.post("/refresh", validateBody(refreshSchema), refresh);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;
