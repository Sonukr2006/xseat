const Ticket = require("../models/Ticket");

const getTravelHistory = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tickets = await Ticket.find({
      userId: req.user._id,
      travelDate: { $lt: today },
    })
      .sort({ travelDate: -1 })
      .lean();
    res.json(tickets);
  } catch (err) {
    next(err);
  }
};

module.exports = { getTravelHistory };
