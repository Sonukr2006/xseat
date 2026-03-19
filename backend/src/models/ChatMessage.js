const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["text", "system"], default: "text" },
  },
  { timestamps: true }
);

chatMessageSchema.index({ matchId: 1, createdAt: 1 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
