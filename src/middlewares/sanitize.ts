import { Request, Response, NextFunction } from "express";

function sanitize(obj: any) {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
      continue;
    }
    sanitize(obj[key]);
  }
}

export default function sanitizeRequest(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
}
