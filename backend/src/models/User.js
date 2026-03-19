const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, unique: true, sparse: true, index: true },
    passwordHash: { type: String },
    passwordSalt: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"], default: "other" },
    preferredBerth: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
