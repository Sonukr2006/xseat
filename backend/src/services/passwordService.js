const crypto = require("crypto");

const ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return { salt, hash };
};

const verifyPassword = (password, user) => {
  if (!user?.passwordHash || !user?.passwordSalt) return false;
  const hash = crypto.pbkdf2Sync(password, user.passwordSalt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  const a = Buffer.from(user.passwordHash, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
};

module.exports = { hashPassword, verifyPassword };
