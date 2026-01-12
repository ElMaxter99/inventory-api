import User from '../models/user.model';
import bcrypt from 'bcrypt';
import { signAccess, signRefresh, verifyRefresh } from '../utils/jwt';
import { hashToken, compareToken, randomToken } from '../utils/crypto';
import { Types } from 'mongoose';

export async function registerUser(email: string, password: string, name?: string) {
  const existing = await User.findOne({ email });
  if (existing) throw { status: 409, message: 'Email already registered' };
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, name });
  return user;
}

export async function loginUser(email: string, password: string) {
  const user: any = await User.findOne({ email });
  if (!user) throw { status: 401, message: 'Invalid credentials' };
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw { status: 401, message: 'Invalid credentials' };

  const access = signAccess({ sub: user._id, email: user.email });
  const refresh = signRefresh({ sub: user._id, rid: randomToken(8) });
  const refreshHash = await hashToken(refresh);
  user.refreshTokens.push({ tokenHash: refreshHash, expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000) });
  user.lastLoginAt = new Date();
  await user.save();
  return { user, access, refresh };
}

export async function rotateRefresh(oldRefreshToken: string) {
  // verify jwt
  let payload: any;
  try {
    payload = verifyRefresh(oldRefreshToken);
  } catch (err) {
    throw { status: 401, message: 'Invalid refresh token' };
  }
  const userId = payload.sub;
  const user: any = await User.findById(userId);
  if (!user) throw { status: 401, message: 'Invalid refresh token' };

  // find matching hashed token (await comparisons)
  let matchIndex = -1;
  for (let i = 0; i < user.refreshTokens.length; i++) {
    const t = user.refreshTokens[i];
    try {
      // compareToken returns promise
      // eslint-disable-next-line no-await-in-loop
      const ok = await compareToken(oldRefreshToken, t.tokenHash);
      if (ok) {
        matchIndex = i;
        break;
      }
    } catch (e) {
      // ignore
    }
  }

  if (matchIndex === -1) {
    // possible reuse - revoke all
    user.refreshTokens = [];
    await user.save();
    throw { status: 401, message: 'Refresh token revoked' };
  }

  // rotate: remove old, add new
  user.refreshTokens.splice(matchIndex, 1);
  const newRefresh = signRefresh({ sub: user._id, rid: randomToken(8) });
  const newHash = await hashToken(newRefresh);
  user.refreshTokens.push({ tokenHash: newHash, expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000) });
  await user.save();
  const access = signAccess({ sub: user._id, email: user.email });
  return { access, refresh: newRefresh };
}

export async function logoutRefresh(userId: Types.ObjectId, refreshToken?: string) {
  const user: any = await User.findById(userId);
  if (!user) return;
  if (!refreshToken) {
    user.refreshTokens = [];
  } else {
    user.refreshTokens = user.refreshTokens.filter((t: any) => {
      try {
        // remove the one matching
        return !compareToken(refreshToken, t.tokenHash);
      } catch {
        return true;
      }
    });
  }
  await user.save();
}
