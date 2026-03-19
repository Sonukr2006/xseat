const auth = require("./authRoutes");
const ticket = require("./ticketRoutes");
const exchange = require("./exchangeRoutes");
const prediction = require("./predictionRoutes");
const assistant = require("./assistantRoutes");
const notifications = require("./notificationRoutes");
const chat = require("./chatRoutes");
const coach = require("./coachRoutes");
const admin = require("./adminRoutes");
const user = require("./userRoutes");

module.exports = {
  auth,
  ticket,
  exchange,
  prediction,
  assistant,
  notifications,
  chat,
  coach,
  admin,
  user,
};
