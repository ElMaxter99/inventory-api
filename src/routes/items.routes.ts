import { Router } from "express";
import {
  createItem,
  listItems,
  getItem,
  updateItem,
  deleteItem,
  addComment,
  deleteComment,
} from "../controllers/item.controller";
import {
  loadInventoryById,
  requireInventoryRole,
  loadItemById,
} from "../middlewares/loaders";
import { requireAuth } from "../middlewares/auth";
import { validateBody, validateQuery } from "../middlewares/validation";
import {
  createItemSchema,
  updateItemSchema,
  listItemsQuerySchema,
  commentSchema,
} from "../validators/item.validator";

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

export default router;
