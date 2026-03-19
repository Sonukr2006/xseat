const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    trainNumber: { type: String, required: true },
    trainName: { type: String, required: true },
    pnr: { type: String },
    travelDate: { type: Date, required: true },
    sourceStation: { type: String, required: true },
    destinationStation: { type: String, required: true },
    coachNumber: { type: String, required: true },
    seatNumber: { type: String, required: true },
    seatType: { type: String, required: true },
    ticketStatus: {
      type: String,
      enum: ["CNF", "RAC", "WL"],
      required: true,
    },
    currentWaitlistPosition: { type: Number, default: null },
    ocrSourceUrl: { type: String, default: null },
    ocrExtraction: {
      rawText: { type: String, default: null },
      confidence: { type: Number, default: null },
      parserVersion: { type: String, default: null },
    },
  },
  { timestamps: true }
);

ticketSchema.index({ trainNumber: 1, travelDate: 1 });

module.exports = mongoose.model("Ticket", ticketSchema);
