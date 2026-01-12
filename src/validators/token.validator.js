const { z } = require("zod");

const refreshSchema = z.object({ refreshToken: z.string().min(10) });

module.exports = { refreshSchema };
