const ChatMessage = require("../models/ChatMessage");
const Match = require("../models/Match");
const ExchangeRequest = require("../models/ExchangeRequest");
const { emitToMatch } = require("../sockets");
const mongoose = require("mongoose");

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const ensureParticipant = async (matchId, userId) => {
  const match = await Match.findById(matchId);
  if (!match) return null;
  const reqA = await ExchangeRequest.findById(match.requestA);
  const reqB = await ExchangeRequest.findById(match.requestB);
  const allowed =
    reqA?.userId.toString() === userId.toString() ||
    reqB?.userId.toString() === userId.toString();
  return allowed ? match : null;
};

const listMessages = async (req, res) => {
  if (!isValidObjectId(req.params.matchId)) {
    return res.status(400).json({ error: "Invalid match id" });
  }
  const match = await ensureParticipant(req.params.matchId, req.user._id);
  if (!match) return res.status(403).json({ error: "Not allowed" });
  const messages = await ChatMessage.find({ matchId: match._id })
    .sort({ createdAt: 1 })
    .lean();
  res.json(messages);
};

const sendMessage = async (req, res) => {
  if (!isValidObjectId(req.params.matchId)) {
    return res.status(400).json({ error: "Invalid match id" });
  }
  const match = await ensureParticipant(req.params.matchId, req.user._id);
  if (!match) return res.status(403).json({ error: "Not allowed" });
  const message = await ChatMessage.create({
    matchId: match._id,
    senderId: req.user._id,
    message: req.body.message,
  });
  emitToMatch(match._id.toString(), "chatMessage", message);
  res.json(message);
};

module.exports = { listMessages, sendMessage };
