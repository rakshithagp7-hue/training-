const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String },
  type: { type: String, enum: ["text", "audio"], default: "text" },
  audioUrl: { type: String },
  duration: { type: Number }, // seconds
}, { timestamps: true });

module.exports = mongoose.model("Tweet", tweetSchema);