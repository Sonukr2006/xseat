const ExchangeRequest = require("../../models/ExchangeRequest");
const Match = require("../../models/Match");
const Ticket = require("../../models/Ticket");
const { sendNotification } = require("../../services/notificationService");

const normalizeStation = (value) => String(value || "").trim().toLowerCase();

const routeOverlap = (a, b) => {
  const aFrom = normalizeStation(a.from);
  const aTo = normalizeStation(a.to);
  const bFrom = normalizeStation(b.from);
  const bTo = normalizeStation(b.to);
  if (!aFrom || !aTo || !bFrom || !bTo) return false;
  if (aFrom === bFrom || aTo === bTo) return true;
  if (aFrom === bTo || aTo === bFrom) return true;
  return aFrom.includes(bFrom) || aTo.includes(bTo) || bFrom.includes(aFrom) || bTo.includes(aTo);
};

const parseCoachNumber = (coach) => {
  const match = String(coach || "").match(/(\d+)/);
  return match ? Number(match[1]) : null;
};

const coachDistance = (coachA, coachB) => {
  if (coachA === coachB) return 0;
  const a = parseCoachNumber(coachA);
  const b = parseCoachNumber(coachB);
  if (a === null || b === null) return 99;
  return Math.abs(a - b);
};

const sameDay = (a, b) => {
  return new Date(a).toDateString() === new Date(b).toDateString();
};

const isCompatible = (reqA, reqB) => {
  if (reqA.trainNumber !== reqB.trainNumber) return false;
  if (!sameDay(reqA.travelDate, reqB.travelDate)) return false;
  if (reqA.haveSeatType !== reqB.wantSeatType) return false;
  if (reqB.haveSeatType !== reqA.wantSeatType) return false;
  return routeOverlap(reqA.routeSegment, reqB.routeSegment);
};

const buildMatch = async (reqA, reqB) => {
  const ticketA = await Ticket.findById(reqA.ticketId).lean();
  const ticketB = await Ticket.findById(reqB.ticketId).lean();
  const distance = coachDistance(ticketA?.coachNumber, ticketB?.coachNumber);
  const match = await Match.create({
    requestA: reqA._id,
    requestB: reqB._id,
    trainNumber: reqA.trainNumber,
    travelDate: reqA.travelDate,
    coachDistance: distance,
  });
  await ExchangeRequest.updateMany(
    { _id: { $in: [reqA._id, reqB._id] } },
    { $set: { status: "matched" } }
  );
  await sendNotification({
    userId: reqA.userId,
    title: "Seat exchange match found",
    body: "We found a compatible passenger for your request.",
    data: { matchId: match._id.toString() },
  });
  await sendNotification({
    userId: reqB.userId,
    title: "Seat exchange match found",
    body: "We found a compatible passenger for your request.",
    data: { matchId: match._id.toString() },
  });
  return match;
};

const runMatchingCycle = async () => {
  const openRequests = await ExchangeRequest.find({ status: "open" }).sort({ createdAt: 1 }).lean();
  const matchedIds = new Set();
  for (let i = 0; i < openRequests.length; i += 1) {
    const reqA = openRequests[i];
    if (matchedIds.has(reqA._id.toString())) continue;
    let bestMatch = null;
    let bestScore = Number.MAX_SAFE_INTEGER;
    for (let j = i + 1; j < openRequests.length; j += 1) {
      const reqB = openRequests[j];
      if (matchedIds.has(reqB._id.toString())) continue;
      if (!isCompatible(reqA, reqB)) continue;
      const ticketA = await Ticket.findById(reqA.ticketId).lean();
      const ticketB = await Ticket.findById(reqB.ticketId).lean();
      const score = coachDistance(ticketA?.coachNumber, ticketB?.coachNumber);
      if (score < bestScore) {
        bestMatch = reqB;
        bestScore = score;
      }
    }
    if (bestMatch) {
      await buildMatch(reqA, bestMatch);
      matchedIds.add(reqA._id.toString());
      matchedIds.add(bestMatch._id.toString());
    }
  }
};

module.exports = { runMatchingCycle, isCompatible };
