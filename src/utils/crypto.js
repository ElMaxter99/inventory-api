const crypto = require("crypto");
const bcrypt = require("bcrypt");

function randomToken(size = 48) {
  return crypto.randomBytes(size).toString('hex');
}

async function hashToken(token) {
  return bcrypt.hash(token, 10);
}

async function compareToken(token, hash) {
  return bcrypt.compare(token, hash);
}

module.exports = {
  randomToken,
  hashToken,
  compareToken,
};
