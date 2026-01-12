import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateBody(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parse = schema.safeParse(req.body);
    if (!parse.success) return res.status(422).json({ data: null, error: { message: parse.error.flatten() } });
    req.body = parse.data;
    next();
  };
}

export function validateParams(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parse = schema.safeParse(req.params);
    if (!parse.success) return res.status(422).json({ data: null, error: { message: parse.error.flatten() } });
    req.params = parse.data;
    next();
  };
}

export function validateQuery(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parse = schema.safeParse(req.query);
    if (!parse.success) return res.status(422).json({ data: null, error: { message: parse.error.flatten() } });
    req.query = parse.data;
    next();
  };
}
