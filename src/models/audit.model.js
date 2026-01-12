const mongoose = require("mongoose");
const { Schema } = mongoose;

const AuditSchema = new Schema({
  action: { type: String, required: true },
  entity: { type: String, required: true },
  entityId: { type: Schema.Types.ObjectId },
  actor: { type: Schema.Types.Mixed },
  diff: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Audit", AuditSchema);
