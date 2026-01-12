import { z } from "zod";

export const createLocatorSchema = z.object({
  targetType: z.enum(["inventory", "zone", "item"]),
  targetId: z.string().min(1),
  mode: z.enum(["private", "public"]).optional(),
  publicEdit: z.boolean().optional(),
});

export const updateLocatorSchema = z.object({
  mode: z.enum(["private", "public"]).optional(),
  publicEdit: z.boolean().optional(),
});
