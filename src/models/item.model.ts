import mongoose, { Schema } from 'mongoose';

const PhotoSchema = new Schema({
  url: String,
  filename: String,
  mimeType: String,
  size: Number,
  createdAt: { type: Date, default: Date.now }
});

const CommentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const AiSuggestionSchema = new Schema({
  provider: String,
  label: String,
  confidence: Number,
  raw: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

const ItemSchema = new Schema(
  {
    inventoryId: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true, index: true },
    zoneId: { type: Schema.Types.ObjectId, ref: 'Zone' },
    parentItemId: { type: Schema.Types.ObjectId, ref: 'Item' },
    type: { type: String, enum: ['object', 'container'], default: 'object' },
    name: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, default: 1 },
    tags: [{ type: String }],
    photos: [PhotoSchema],
    comments: [CommentSchema],
    attributes: { type: Schema.Types.Mixed },
    aiSuggestion: AiSuggestionSchema,
    createdByUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedByUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedByPublic: { type: Boolean, default: false },
    updatedByActor: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('Item', ItemSchema);
