import { Router } from "express";
import { addMember, updateMemberRole, removeMember } from "../controllers/member.controller";
import { requireAuth } from "../middlewares/auth";
import { loadInventoryById, requireInventoryRole } from "../middlewares/loaders";
import { validateBody } from "../middlewares/validation";
import { addMemberSchema, updateMemberSchema } from "../validators/member.validator";

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

export default router;
