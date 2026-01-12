const { z } = require("zod");

const addMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["owner", "admin", "editor", "viewer"]).default("viewer"),
});

const updateMemberSchema = z.object({
  role: z.enum(["owner", "admin", "editor", "viewer"]),
});

module.exports = {
  addMemberSchema,
  updateMemberSchema,
};
