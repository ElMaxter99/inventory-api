const mongoose = require("mongoose");
const { Schema } = mongoose;

const LocatorSchema = new Schema(
  {
    inventoryId: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true, index: true },
    targetType: { type: String, enum: ['inventory', 'zone', 'item'], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    token: { type: String, required: true, index: true, unique: true },
    mode: { type: String, enum: ['private', 'public'], default: 'private' },
    publicEdit: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Locator", LocatorSchema);
