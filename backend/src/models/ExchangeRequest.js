const mongoose = require("mongoose");

const exchangeRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    trainNumber: { type: String, required: true },
    travelDate: { type: Date, required: true },
    haveSeatType: { type: String, required: true },
    wantSeatType: { type: String, required: true },
    coachPreference: { type: String },
    routeSegment: {
      from: { type: String, required: true },
      to: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["open", "matched", "confirmed", "cancelled"],
      default: "open",
    },
  },
  { timestamps: true }
);

exchangeRequestSchema.index({ trainNumber: 1, travelDate: 1, status: 1 });

module.exports = mongoose.model("ExchangeRequest", exchangeRequestSchema);
