import { z } from "zod";

export const addMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["owner", "admin", "editor", "viewer"]).default("viewer"),
});

export const updateMemberSchema = z.object({
  role: z.enum(["owner", "admin", "editor", "viewer"]),
});
