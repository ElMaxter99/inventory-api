import { Request, Response, NextFunction } from 'express';
import { verifyAccess } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: any;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ data: null, error: { message: 'Unauthorized' } });
    const token = header.split(' ')[1];
    const payload = verifyAccess(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ data: null, error: { message: 'Invalid token' } });
  }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return next();
  try {
    const token = header.split(' ')[1];
    req.user = verifyAccess(token);
  } catch (_) {
    // ignore invalid token
  }
  next();
}
