const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: String, enum: ["Free", "Bronze", "Silver", "Gold"], default: "Free" },
  tweetLimit: { type: Number, default: 1 },
  tweetsUsed: { type: Number, default: 0 },
  amountPaid: { type: Number, default: 0 },
  paymentId: { type: String },
  startDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);