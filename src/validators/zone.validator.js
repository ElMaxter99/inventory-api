const { z } = require("zod");

const createZoneSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().optional(),
});

const updateZoneSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  order: z.number().int().optional(),
});

const reorderZonesSchema = z.object({
  zoneIds: z.array(z.string().min(1)),
});

module.exports = {
  createZoneSchema,
  updateZoneSchema,
  reorderZonesSchema,
};
