const Notification = require("../models/Notification");
const DeviceToken = require("../models/DeviceToken");

const listNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  res.json(notifications);
};

const markRead = async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { readAt: new Date() },
    { new: true }
  );
  if (!notification) return res.status(404).json({ error: "Notification not found" });
  res.json(notification);
};

const registerDevice = async (req, res) => {
  const { token, platform } = req.body;
  if (!token) return res.status(400).json({ error: "Missing token" });
  await DeviceToken.updateOne(
    { userId: req.user._id, token },
    { $set: { platform: platform || "web" } },
    { upsert: true }
  );
  res.json({ status: "registered" });
};

module.exports = { listNotifications, markRead, registerDevice };
