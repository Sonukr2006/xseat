const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String },
    passwordHash: { type: String },
    passwordSalt: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"], default: "other" },
    preferredBerth: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

userSchema.index(
  { email: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { email: { $type: "string" } },
  }
);

userSchema.index(
  { phone: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { phone: { $type: "string" } },
  }
);

module.exports = mongoose.model("User", userSchema);
