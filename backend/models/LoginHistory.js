const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  browser: String,
  os: String,
  deviceType: String,
  ip: String,
}, { timestamps: true });

module.exports = mongoose.model("LoginHistory", loginHistorySchema);