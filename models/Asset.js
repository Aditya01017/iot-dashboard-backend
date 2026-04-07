const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  assetType: { type: String, required: true },
  status: { type: String, required: true, enum: ['online', 'offline', 'UNKNOWN'] },
  health: { type: String, required: true },
  tags: [{ type: String }],
  alarms: {
    critical: { type: Number, default: 0 },
    major: { type: Number, default: 0 },
    minor: { type: Number, default: 0 }
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);
