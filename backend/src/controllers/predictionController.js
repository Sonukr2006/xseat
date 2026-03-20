const { predictWaitlist } = require("../services/predictionService");

const reasonForPrediction = ({ currentWaitlist, travelDate, result }) => {
  const wl = Number(currentWaitlist || 0);
  const travel = new Date(travelDate);
  const today = new Date();
  const daysToTravel = Math.max(0, Math.ceil((travel.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  if (result.predictedStatus === 'CNF') {
    return `Low waitlist (WL${wl}) with ${daysToTravel} day(s) left; cancellations typically improve confirmation.`;
  }
  if (result.predictedStatus === 'RAC') {
    return `Moderate waitlist (WL${wl}); chances improve closer to departure but may end as RAC.`;
  }
  return `High waitlist (WL${wl}); limited time (${daysToTravel} day(s)) reduces confirmation odds.`;
};

const waitlist = async (req, res) => {
  const { trainNumber, travelDate, currentWaitlist } = req.query;
  const result = await predictWaitlist({ trainNumber, travelDate, currentWaitlist });
  const reason = reasonForPrediction({ currentWaitlist, travelDate, result });
  res.json({ ...result, reason });
};

module.exports = { waitlist };
