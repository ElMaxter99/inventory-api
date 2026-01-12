const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { signAccess, signRefresh, verifyRefresh } = require("../utils/jwt");
const { hashToken, compareToken, randomToken } = require("../utils/crypto");

async function registerUser(email, password, name) {
  const existing = await User.findOne({ email });
  if (existing) throw { status: 409, message: 'Email already registered' };
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, name });
  return user;
}

async function loginUser(email, password) {
  const user = await User.findOne({ email });
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

async function rotateRefresh(oldRefreshToken) {
  // verify jwt
  let payload;
  try {
    payload = verifyRefresh(oldRefreshToken);
  } catch (err) {
    throw { status: 401, message: 'Invalid refresh token' };
  }
  const userId = payload.sub;
  const user = await User.findById(userId);
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

async function logoutRefresh(userId, refreshToken) {
  const user = await User.findById(userId);
  if (!user) return;
  if (!refreshToken) {
    user.refreshTokens = [];
  } else {
    const filtered = [];
    for (const token of user.refreshTokens) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const matches = await compareToken(refreshToken, token.tokenHash);
        if (!matches) filtered.push(token);
      } catch {
        filtered.push(token);
      }
    }
    user.refreshTokens = filtered;
  }
  await user.save();
}

module.exports = {
  registerUser,
  loginUser,
  rotateRefresh,
  logoutRefresh,
};
