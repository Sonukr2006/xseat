const Ticket = require("../models/Ticket");
const ExchangeRequest = require("../models/ExchangeRequest");

const insights = async (req, res) => {
  const tickets = await Ticket.find({ userId: req.user._id }).lean();
  const insightsList = [];

  for (const ticket of tickets) {
    const openRequests = await ExchangeRequest.countDocuments({
      trainNumber: ticket.trainNumber,
      travelDate: ticket.travelDate,
      status: "open",
    });
    if (openRequests > 0) {
      insightsList.push({
        type: "exchange",
        message: `${openRequests} nearby passengers are seeking exchanges on train ${ticket.trainNumber}.`,
        trainNumber: ticket.trainNumber,
      });
    }
  }

  if (insightsList.length === 0) {
    insightsList.push({
      type: "general",
      message: "No active exchange opportunities right now. We'll alert you when matches appear.",
    });
  }

  res.json({ insights: insightsList });
};

module.exports = { insights };
