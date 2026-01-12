import { z } from "zod";

export const createItemSchema = z.object({
  zoneId: z.string().optional(),
  parentItemId: z.string().optional(),
  type: z.enum(["object", "container"]).optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  quantity: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
  attributes: z.record(z.any()).optional(),
});

export const updateItemSchema = z.object({
  zoneId: z.string().optional(),
  parentItemId: z.string().optional().nullable(),
  type: z.enum(["object", "container"]).optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  quantity: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
  attributes: z.record(z.any()).optional(),
});

export const listItemsQuerySchema = z.object({
  zoneId: z.string().optional(),
  parentItemId: z.string().optional(),
  search: z.string().optional(),
  tags: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["createdAt", "name"]).optional(),
});

export const commentSchema = z.object({
  text: z.string().min(1),
});

export const publicItemUpdateSchema = z.object({
  itemId: z.string().optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  quantity: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
  attributes: z.record(z.any()).optional(),
});
