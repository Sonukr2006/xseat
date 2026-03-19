const Notification = require("../models/Notification");
const DeviceToken = require("../models/DeviceToken");
const { emitToUser } = require("../sockets");
const { sendPush } = require("./firebaseService");

const sendNotification = async ({ userId, title, body, data }) => {
  const notification = await Notification.create({
    userId,
    title,
    body,
    data,
  });
  emitToUser(userId.toString(), "notification", notification);
  const tokens = await DeviceToken.find({ userId }).lean();
  if (tokens.length > 0) {
    await sendPush({
      tokens: tokens.map((t) => t.token),
      title,
      body,
      data,
    });
  }
  return notification;
};

module.exports = { sendNotification };
