const env = require("../config/env");

const store = new Map();

const generateOtp = (phone) => {
  const otp = env.nodeEnv === "development" ? env.otpDevBypass : String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + env.otpExpiryMinutes * 60 * 1000;
  store.set(phone, { otp, expiresAt });
  return otp;
};

const verifyOtp = (phone, otp) => {
  const record = store.get(phone);
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    store.delete(phone);
    return false;
  }
  const isValid = record.otp === otp;
  if (isValid) store.delete(phone);
  return isValid;
};

module.exports = { generateOtp, verifyOtp };
