const { Router } = require("express");
const {
  createItem,
  listItems,
  getItem,
  updateItem,
  deleteItem,
  addComment,
  deleteComment,
} = require("../controllers/item.controller");
const {
  loadInventoryById,
  requireInventoryRole,
  loadItemById,
} = require("../middlewares/loaders");
const { requireAuth } = require("../middlewares/auth");
const { validateBody, validateQuery } = require("../middlewares/validation");
const {
  createItemSchema,
  updateItemSchema,
  listItemsQuerySchema,
  commentSchema,
} = require("../validators/item.validator");

const router = Router({ mergeParams: true });

router.post(
  "/",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("editor"),
  validateBody(createItemSchema),
  createItem
);
router.get(
  "/",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("viewer"),
  validateQuery(listItemsQuerySchema),
  listItems
);
router.get(
  "/:itemId",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("viewer"),
  loadItemById,
  getItem
);
router.patch(
  "/:itemId",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("editor"),
  loadItemById,
  validateBody(updateItemSchema),
  updateItem
);
router.delete(
  "/:itemId",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("admin"),
  loadItemById,
  deleteItem
);
router.post(
  "/:itemId/comments",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("viewer"),
  loadItemById,
  validateBody(commentSchema),
  addComment
);
router.delete(
  "/:itemId/comments/:commentId",
  requireAuth,
  loadInventoryById,
  requireInventoryRole("editor"),
  loadItemById,
  deleteComment
);

module.exports = router;
