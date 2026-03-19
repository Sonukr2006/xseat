const ExchangeRequest = require("../models/ExchangeRequest");
const Match = require("../models/Match");
const Ticket = require("../models/Ticket");
const { sendNotification } = require("../services/notificationService");
const { buildQr } = require("../services/qrService");
const { emitToMatch } = require("../sockets");

const requestExchange = async (req, res) => {
  const { ticketId, haveSeatType, wantSeatType, coachPreference, routeSegment } = req.body;
  const ticket = await Ticket.findOne({ _id: ticketId, userId: req.user._id });
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });

  const exchange = await ExchangeRequest.create({
    userId: req.user._id,
    ticketId,
    trainNumber: ticket.trainNumber,
    travelDate: ticket.travelDate,
    haveSeatType,
    wantSeatType,
    coachPreference,
    routeSegment,
  });
  res.json(exchange);
};

const listMatches = async (req, res) => {
  const requests = await ExchangeRequest.find({ userId: req.user._id }).select("_id");
  const requestIds = requests.map((r) => r._id);
  const matches = await Match.find({
    $or: [{ requestA: { $in: requestIds } }, { requestB: { $in: requestIds } }],
  })
    .sort({ createdAt: -1 })
    .lean();
  res.json(matches);
};

const confirmExchange = async (req, res) => {
  const { matchId, confirm } = req.body;
  const match = await Match.findById(matchId);
  if (!match) return res.status(404).json({ error: "Match not found" });

  const reqA = await ExchangeRequest.findById(match.requestA);
  const reqB = await ExchangeRequest.findById(match.requestB);
  const isA = reqA.userId.toString() === req.user._id.toString();
  const isB = reqB.userId.toString() === req.user._id.toString();
  if (!isA && !isB) return res.status(403).json({ error: "Not your match" });

  if (!confirm) {
    match.status = "cancelled";
    await match.save();
    await ExchangeRequest.updateMany(
      { _id: { $in: [reqA._id, reqB._id] } },
      { $set: { status: "open" } }
    );
    await sendNotification({
      userId: isA ? reqB.userId : reqA.userId,
      title: "Exchange cancelled",
      body: "The other passenger cancelled the exchange.",
      data: { matchId: match._id.toString() },
    });
    return res.json(match);
  }

  if (isA) match.confirmations.a = true;
  if (isB) match.confirmations.b = true;

  if (match.confirmations.a && match.confirmations.b) {
    match.status = "confirmed";
    match.confirmedAt = new Date();
    const payload = {
      matchId: match._id.toString(),
      trainNumber: match.trainNumber,
      travelDate: match.travelDate,
      requestA: reqA._id.toString(),
      requestB: reqB._id.toString(),
    };
    const qr = await buildQr(payload);
    match.qrPayload = qr.text;
    match.qrImage = qr.dataUrl;
    await ExchangeRequest.updateMany(
      { _id: { $in: [reqA._id, reqB._id] } },
      { $set: { status: "confirmed" } }
    );
    await sendNotification({
      userId: reqA.userId,
      title: "Exchange confirmed",
      body: "QR confirmation is ready for the TTE.",
      data: { matchId: match._id.toString() },
    });
    await sendNotification({
      userId: reqB.userId,
      title: "Exchange confirmed",
      body: "QR confirmation is ready for the TTE.",
      data: { matchId: match._id.toString() },
    });
  }

  await match.save();
  emitToMatch(match._id.toString(), "matchUpdated", match);
  res.json(match);
};

module.exports = { requestExchange, listMatches, confirmExchange };
