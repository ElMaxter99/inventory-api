import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

export const rateLimitPublicEndpoints = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

export function requirePublicTokenAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const inv = (req as any).inventory;
  if (!inv || !inv.publicAccess || !inv.publicAccess.enabled) {
    return res
      .status(403)
      .json({ data: null, error: { message: "Public access disabled" } });
  }
  next();
}
