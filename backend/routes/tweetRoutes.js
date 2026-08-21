const express = require("express");
const router = express.Router();
const Tweet = require("../models/Tweet");
const authMiddleware = require("../middleware/authMiddleware");

// Create tweet
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const tweet = await Tweet.create({ userId: req.user._id, text });
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