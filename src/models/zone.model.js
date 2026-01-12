const mongoose = require("mongoose");
const { Schema } = mongoose;

const ZoneSchema = new Schema(
  {
    inventoryId: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Zone", ZoneSchema);
