import mongoose, { Schema } from 'mongoose';

const ZoneSchema = new Schema(
  {
    inventoryId: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Zone', ZoneSchema);
