import { Request, Response } from 'express';
import { registerUser, loginUser, rotateRefresh, logoutRefresh } from '../services/auth.service';

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body;
  const user = await registerUser(email, password, name);
  res.status(201).json({ data: { id: user._id, email: user.email, name: user.name }, error: null });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const { user, access, refresh } = await loginUser(email, password);
  res.json({ data: { user: { id: user._id, email: user.email, name: user.name }, access, refresh }, error: null });
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;
  const tokens = await rotateRefresh(refreshToken);
  res.json({ data: tokens, error: null });
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.body;
  // if authenticated, remove for that user; else ignore
  const uid = (req as any).user?.sub;
  if (uid) await logoutRefresh(uid, refreshToken);
  res.json({ data: true, error: null });
}

export async function me(req: Request, res: Response) {
  const payload = (req as any).user;
  res.json({ data: payload || null, error: null });
}
