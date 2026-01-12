const { z } = require("zod");

const createLocatorSchema = z.object({
  targetType: z.enum(["inventory", "zone", "item"]),
  targetId: z.string().min(1),
  mode: z.enum(["private", "public"]).optional(),
  publicEdit: z.boolean().optional(),
});

const updateLocatorSchema = z.object({
  mode: z.enum(["private", "public"]).optional(),
  publicEdit: z.boolean().optional(),
});

module.exports = {
  createLocatorSchema,
  updateLocatorSchema,
};
