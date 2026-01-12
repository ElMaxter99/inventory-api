const mongoose = require("mongoose");
const { Schema } = mongoose;

const MemberSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['owner', 'admin', 'editor', 'viewer'], default: 'viewer' }
});

const PublicAccessSchema = new Schema({
  enabled: { type: Boolean, default: false },
  token: { type: String, index: true, unique: true, sparse: true },
  allowPublicEdit: { type: Boolean, default: false }
});

const InventorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    ownerUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    visibility: { type: String, enum: ['private', 'public'], default: 'private' },
    publicAccess: { type: PublicAccessSchema, default: () => ({}) },
    members: [MemberSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", InventorySchema);
