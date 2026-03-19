const { predictWaitlist } = require("../services/predictionService");

const waitlist = async (req, res) => {
  const { trainNumber, travelDate, currentWaitlist } = req.query;
  const result = await predictWaitlist({ trainNumber, travelDate, currentWaitlist });
  res.json(result);
};

module.exports = { waitlist };
