const { z } = require("zod");

const createInventorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  visibility: z.enum(['private', 'public']).optional()
});

const updateInventorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  visibility: z.enum(['private', 'public']).optional()
});

const publicAccessSchema = z.object({
  allowPublicEdit: z.boolean().optional(),
  visibility: z.enum(["private", "public"]).optional(),
});

module.exports = {
  createInventorySchema,
  updateInventorySchema,
  publicAccessSchema,
};
