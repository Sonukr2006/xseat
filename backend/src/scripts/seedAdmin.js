const { connectDb } = require("../config/db");
const User = require("../models/User");
const { hashPassword } = require("../services/passwordService");

const run = async () => {
  await connectDb();
  const email = process.env.ADMIN_EMAIL || "admin@xseat.local";
  const password = process.env.ADMIN_PASSWORD || "Admin@123";
  const existing = await User.findOne({ email });
  if (!existing) {
    const { hash, salt } = hashPassword(password);
    await User.create({
      name: "XSEAT Admin",
      role: "admin",
      email,
      passwordHash: hash,
      passwordSalt: salt,
    });
  }
  console.log(`Admin seeded. Email: ${email}`);
  process.exit(0);
};

run();
