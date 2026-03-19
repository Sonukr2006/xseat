const User = require("../models/User");
const { generateOtp, verifyOtp } = require("../services/otpService");
const { hashPassword, verifyPassword } = require("../services/passwordService");
const { signToken } = require("../services/tokenService");
const env = require("../config/env");

const sanitizeUser = (user) => {
  if (!user) return user;
  const payload = user.toObject ? user.toObject() : { ...user };
  delete payload.passwordHash;
  delete payload.passwordSalt;
  return payload;
};

const login = async (req, res) => {
  const { email, password, phone, name } = req.body;
  if (email && password) {
    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !verifyPassword(password, user)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.session.userId = user._id.toString();
    const token = signToken(user);
    return res.json({ token, user: sanitizeUser(user) });
  }

  if (!phone) {
    return res.status(400).json({ error: "Phone number or email/password is required" });
  }

  const otp = generateOtp(phone);
  if (name) {
    await User.findOneAndUpdate({ phone }, { $setOnInsert: { name } }, { upsert: true, new: false });
  }
  const payload = { status: "otp_sent" };
  if (env.nodeEnv === "development") {
    payload.otp = otp;
  }
  return res.json(payload);
};

const verify = async (req, res) => {
  const { phone, otp } = req.body;
  const isValid = verifyOtp(phone, otp);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid OTP" });
  }
  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ phone, name: "New Passenger" });
  }
  req.session.userId = user._id.toString();
  const token = signToken(user);
  res.json({ token, user: sanitizeUser(user) });
};

const profile = async (req, res) => {
  const user = await User.findById(req.user._id).lean();
  res.json(sanitizeUser(user));
};

const updateProfile = async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json(sanitizeUser(user));
};

const logout = async (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ status: "logged_out" });
  });
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = String(email).toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }
  const { hash, salt } = hashPassword(password);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hash,
    passwordSalt: salt,
  });
  req.session.userId = user._id.toString();
  const token = signToken(user);
  res.status(201).json({ token, user: sanitizeUser(user) });
};

module.exports = { login, verify, profile, updateProfile, logout, signup };
