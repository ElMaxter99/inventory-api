const jwt = require("jsonwebtoken");
const config = require("../config");

function signAccess(payload) {
  return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpires });
}

function signRefresh(payload) {
  return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpires });
}

function verifyAccess(token) {
  return jwt.verify(token, config.jwt.accessSecret);
}

function verifyRefresh(token) {
  return jwt.verify(token, config.jwt.refreshSecret);
}

module.exports = {
  signAccess,
  signRefresh,
  verifyAccess,
  verifyRefresh,
};
