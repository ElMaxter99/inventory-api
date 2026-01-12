const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const RefreshTokenSchema = new Schema({
  tokenHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  revokedAt: { type: Date },
  meta: { type: Schema.Types.Mixed }
});

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    status: { type: String, enum: ['active', 'disabled'], default: 'active' },
    rolesGlobal: [{ type: String }],
    refreshTokens: [RefreshTokenSchema],
    lastLoginAt: { type: Date }
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.pre('save', async function (next) {
  const u = this;
  if (u.isModified('passwordHash')) {
    // assume passwordHash already hashed when set; do nothing
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
