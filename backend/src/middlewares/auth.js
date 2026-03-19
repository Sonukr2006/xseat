const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");

const auth = async (req, res, next) => {
  if (req.session?.userId) {
    const user = await User.findById(req.session.userId).lean();
    if (!user) {
      return res.status(401).json({ error: "Invalid session" });
    }
    req.user = user;
    return next();
  }
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.sub).lean();
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

module.exports = { auth, adminOnly };
