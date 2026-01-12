import jwt from 'jsonwebtoken';
import config from '../config';

export function signAccess(payload: object) {
  return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpires });
}

export function signRefresh(payload: object) {
  return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpires });
}

export function verifyAccess(token: string) {
  return jwt.verify(token, config.jwt.accessSecret);
}

export function verifyRefresh(token: string) {
  return jwt.verify(token, config.jwt.refreshSecret);
}
