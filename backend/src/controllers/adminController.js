const User = require("../models/User");
const Ticket = require("../models/Ticket");
const ExchangeRequest = require("../models/ExchangeRequest");
const Match = require("../models/Match");
const Notification = require("../models/Notification");

const analytics = async (req, res) => {
  const [users, tickets, exchanges, matches, confirmedMatches, notifications] = await Promise.all([
    User.countDocuments(),
    Ticket.countDocuments(),
    ExchangeRequest.countDocuments(),
    Match.countDocuments(),
    Match.countDocuments({ status: "confirmed" }),
    Notification.countDocuments(),
  ]);
  res.json({ users, tickets, exchanges, matches, confirmedMatches, notifications });
};

const listUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(100).lean();
  res.json(users);
};

const listExchanges = async (req, res) => {
  const exchanges = await ExchangeRequest.find().sort({ createdAt: -1 }).limit(100).lean();
  res.json(exchanges);
};

const listMatches = async (req, res) => {
  const matches = await Match.find().sort({ createdAt: -1 }).limit(100).lean();
  res.json(matches);
};

const adminDashboard = async (req, res) => {
  const [latestUsers, latestTickets, latestRequests, latestMatches, latestNotifications] = await Promise.all([
    User.find().sort({ createdAt: -1 }).limit(8).lean(),
    Ticket.find().populate("userId", "name phone").sort({ createdAt: -1 }).limit(8).lean(),
    ExchangeRequest.find().populate("userId", "name phone").populate("ticketId").sort({ createdAt: -1 }).limit(8).lean(),
    Match.find()
      .populate({
        path: "requestA",
        populate: [
          { path: "userId", select: "name phone" },
          { path: "ticketId", select: "coachNumber seatNumber trainNumber" },
        ],
      })
      .populate({
        path: "requestB",
        populate: [
          { path: "userId", select: "name phone" },
          { path: "ticketId", select: "coachNumber seatNumber trainNumber" },
        ],
      })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean(),
    Notification.find().populate("userId", "name phone").sort({ createdAt: -1 }).limit(8).lean(),
  ]);

  res.json({
    latestUsers,
    latestTickets,
    latestRequests,
    latestMatches,
    latestNotifications,
  });
};

const listTickets = async (req, res) => {
  const tickets = await Ticket.find().populate("userId", "name phone").sort({ travelDate: 1, createdAt: -1 }).limit(250).lean();
  res.json(tickets);
};

const listNotifications = async (req, res) => {
  const notifications = await Notification.find().populate("userId", "name phone").sort({ createdAt: -1 }).limit(250).lean();
  res.json(notifications);
};

module.exports = { analytics, listUsers, listExchanges, listMatches, adminDashboard, listTickets, listNotifications };
