const mongoose = require("mongoose");

const deviceTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    platform: { type: String, enum: ["android", "ios", "web"], default: "web" },
  },
  { timestamps: true }
);

deviceTokenSchema.index({ userId: 1, token: 1 }, { unique: true });

module.exports = mongoose.model("DeviceToken", deviceTokenSchema);
