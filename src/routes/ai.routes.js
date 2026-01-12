const { Router } = require("express");
const { suggest } = require("../controllers/ai.controller");
const { requireAuth } = require("../middlewares/auth");
const {
  loadInventoryById,
  requireInventoryRole,
  loadItemById,
} = require("../middlewares/loaders");

const router = Router({ mergeParams: true });

router.post(
  "/:itemId/ai/suggest",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("editor"),
  loadItemById,
  suggest
);

module.exports = router;
