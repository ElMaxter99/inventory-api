const { verifyAccess } = require("../utils/jwt");

function requireAuth(req, res, next) {
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

function optionalAuth(req, res, next) {
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

module.exports = {
  requireAuth,
  optionalAuth,
};
