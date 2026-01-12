import { z } from 'zod';

export const createInventorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  visibility: z.enum(['private', 'public']).optional()
});

export const updateInventorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  visibility: z.enum(['private', 'public']).optional()
});

export const publicAccessSchema = z.object({
  allowPublicEdit: z.boolean().optional(),
  visibility: z.enum(["private", "public"]).optional(),
});
