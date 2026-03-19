const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    requestA: { type: mongoose.Schema.Types.ObjectId, ref: "ExchangeRequest" },
    requestB: { type: mongoose.Schema.Types.ObjectId, ref: "ExchangeRequest" },
    trainNumber: { type: String, required: true },
    travelDate: { type: Date, required: true },
    coachDistance: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    confirmations: {
      a: { type: Boolean, default: false },
      b: { type: Boolean, default: false },
    },
    qrPayload: { type: String },
    qrImage: { type: String },
    confirmedAt: { type: Date },
  },
  { timestamps: true }
);

matchSchema.index({ trainNumber: 1, travelDate: 1 });

module.exports = mongoose.model("Match", matchSchema);
