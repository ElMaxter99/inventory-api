import mongoose, { Schema } from 'mongoose';

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

export default mongoose.model('Locator', LocatorSchema);
