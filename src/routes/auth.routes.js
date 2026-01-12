const { Router } = require("express");
const {
  register,
  login,
  refresh,
  logout,
  me,
} = require("../controllers/auth.controller");
const { validateBody } = require("../middlewares/validation");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const { refreshSchema } = require("../validators/token.validator");
const { requireAuth } = require("../middlewares/auth");

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/refresh", validateBody(refreshSchema), refresh);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

module.exports = router;
