const {
  registerUser,
  loginUser,
  rotateRefresh,
  logoutRefresh,
} = require("../services/auth.service");

async function register(req, res) {
  const { email, password, name } = req.body;
  const user = await registerUser(email, password, name);
  res.status(201).json({ data: { id: user._id, email: user.email, name: user.name }, error: null });
}

async function login(req, res) {
  const { email, password } = req.body;
  const { user, access, refresh } = await loginUser(email, password);
  res.json({ data: { user: { id: user._id, email: user.email, name: user.name }, access, refresh }, error: null });
}

async function refresh(req, res) {
  const { refreshToken } = req.body;
  const tokens = await rotateRefresh(refreshToken);
  res.json({ data: tokens, error: null });
}

async function logout(req, res) {
  const { refreshToken } = req.body;
  // if authenticated, remove for that user; else ignore
  const uid = req.user?.sub;
  if (uid) await logoutRefresh(uid, refreshToken);
  res.json({ data: true, error: null });
}

async function me(req, res) {
  const payload = req.user;
  res.json({ data: payload || null, error: null });
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
};
