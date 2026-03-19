const axios = require("axios");
const env = require("../config/env");

const heuristicPrediction = ({ currentWaitlist }) => {
  const wl = Number(currentWaitlist || 0);
  const base = Math.max(0, 1 - wl / 80);
  const probability = Math.min(0.95, Math.max(0.05, base));
  const predictedStatus = probability > 0.6 ? "CNF" : probability > 0.3 ? "RAC" : "WL";
  return { probability, predictedStatus, model: "heuristic" };
};

const predictWaitlist = async ({ trainNumber, travelDate, currentWaitlist }) => {
  try {
    const response = await axios.get(
      `${env.predictionServiceUrl}/prediction/waitlist`,
      {
        params: { train_number: trainNumber, travel_date: travelDate, current_waitlist: currentWaitlist },
        timeout: 2500,
      }
    );
    return { ...response.data, model: "ml" };
  } catch (err) {
    return heuristicPrediction({ currentWaitlist });
  }
};

module.exports = { predictWaitlist };
