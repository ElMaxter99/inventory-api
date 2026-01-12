const { Router } = require("express");
const {
  addMember,
  updateMemberRole,
  removeMember,
} = require("../controllers/member.controller");
const { requireAuth } = require("../middlewares/auth");
const { loadInventoryById, requireInventoryRole } = require("../middlewares/loaders");
const { validateBody } = require("../middlewares/validation");
const { addMemberSchema, updateMemberSchema } = require("../validators/member.validator");

const router = Router({ mergeParams: true });

router.post(
  "/",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("admin"),
  validateBody(addMemberSchema),
  addMember
);
router.patch(
  "/:memberId",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("admin"),
  validateBody(updateMemberSchema),
  updateMemberRole
);
router.delete(
  "/:memberId",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("admin"),
  removeMember
);

module.exports = router;
