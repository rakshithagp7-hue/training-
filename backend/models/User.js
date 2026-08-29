const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  lastPasswordResetRequest: { type: Date },
  loginOtp: { type: String },
  loginOtpExpires: { type: Date },
  audioOtp: { type: String },
  audioOtpExpires: { type: Date },
  notificationsEnabled: { type: Boolean, default: true },
  preferredLanguage: { type: String, default: "en" },
  languageOtp: { type: String },
  languageOtpExpiry: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);