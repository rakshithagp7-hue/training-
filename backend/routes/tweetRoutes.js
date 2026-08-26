const Subscription = require("../models/Subscription");
const express = require("express");
const router = express.Router();
const Tweet = require("../models/Tweet");
const authMiddleware = require("../middleware/authMiddleware");

// Create tweet
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    const sub = await Subscription.findOne({ userId: req.user._id });
    const limit = sub ? sub.tweetLimit : 1;
    const used = sub ? sub.tweetsUsed : 0;

    if (used >= limit) {
      return res.status(403).json({ message: "Tweet limit reached for your current plan. Please upgrade." });
    }

    const tweet = await Tweet.create({ userId: req.user._id, text });

    if (sub) {
      sub.tweetsUsed += 1;
      await sub.save();
    }

    res.status(201).json(tweet);
  } catch (err) {
    res.status(500).json({ message: "Failed to post tweet", error: err.message });
  }
});

// Get all tweets
router.get("/", async (req, res) => {
  try {
    const tweets = await Tweet.find().populate("userId", "username").sort({ createdAt: -1 });
    res.json(tweets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tweets", error: err.message });
  }
});

module.exports = router;