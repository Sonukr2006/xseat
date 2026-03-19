const jwt = require("jsonwebtoken");
const env = require("../config/env");

const signToken = (user) => {
  return jwt.sign(
    { role: user.role },
    env.jwtSecret,
    { subject: user._id.toString(), expiresIn: "7d" }
  );
};

module.exports = { signToken };
