const rateLimit = require("express-rate-limit");

const rateLimitPublicEndpoints = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

function requirePublicTokenAccess(req, res, next) {
  const inv = req.inventory;
  if (!inv || !inv.publicAccess || !inv.publicAccess.enabled) {
    return res
      .status(403)
      .json({ data: null, error: { message: "Public access disabled" } });
  }
  next();
}

module.exports = {
  rateLimitPublicEndpoints,
  requirePublicTokenAccess,
};
