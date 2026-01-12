import crypto from 'crypto';
import bcrypt from 'bcrypt';

export function randomToken(size = 48) {
  return crypto.randomBytes(size).toString('hex');
}

export async function hashToken(token: string) {
  return bcrypt.hash(token, 10);
}

export async function compareToken(token: string, hash: string) {
  return bcrypt.compare(token, hash);
}
