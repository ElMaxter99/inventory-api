import { z } from "zod";

export const createZoneSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().optional(),
});

export const updateZoneSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  order: z.number().int().optional(),
});

export const reorderZonesSchema = z.object({
  zoneIds: z.array(z.string().min(1)),
});
