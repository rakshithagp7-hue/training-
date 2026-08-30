
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { parseFile } = require("music-metadata");
const Tweet = require("../models/Tweet");
const authMiddleware = require("../middleware/authMiddleware");
const generateOtp = require("../utils/generateOtp");
const sendAudioOtp = require("../utils/sendAudioOtp");
const isWithinAudioUploadWindow = require("../utils/audioTimeCheck");

const MAX_SIZE = 100 * 1024 * 1024; // 100 MB
const MAX_DURATION = 5 * 60; // 5 minutes in seconds

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/audio"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: MAX_SIZE } });

// Step 1: Request OTP before upload
router.post("/request-otp", authMiddleware, async (req, res) => {
  try {
    if (!isWithinAudioUploadWindow()) {
      return res.status(403).json({ message: "Audio tweets can only be posted between 2:00 PM and 7:00 PM IST." });
    }

        const otp = generateOtp();
    req.user.audioOtp = otp;
    req.user.audioOtpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await req.user.save();

    try {
      await sendAudioOtp(req.user.email, otp);
    } catch (emailErr) {
      console.log("Audio OTP email failed to send. OTP for", req.user.email, "is:", otp);
    }

    res.json({ message: "OTP sent to your registered email. (Check Render logs if not received)" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

// Step 2: Upload audio with OTP
router.post("/", authMiddleware, upload.single("audio"), async (req, res) => {
  try {
    if (!isWithinAudioUploadWindow()) {
      return res.status(403).json({ message: "Audio tweets can only be posted between 2:00 PM and 7:00 PM IST." });
    }

    const { otp } = req.body;
    if (!req.user.audioOtp || req.user.audioOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (req.user.audioOtpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired, please request a new one." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No audio file uploaded." });
    }

    const metadata = await parseFile(req.file.path);
    const duration = metadata.format.duration;

    if (duration > MAX_DURATION) {
      return res.status(400).json({ message: "Audio must be 5 minutes or shorter." });
    }

    req.user.audioOtp = undefined;
    req.user.audioOtpExpires = undefined;
    await req.user.save();

    const audioUrl = `/uploads/audio/${req.file.filename}`;
    const tweet = await Tweet.create({
      userId: req.user._id,
      type: "audio",
      audioUrl,
      duration,
    });

    res.status(201).json(tweet);
  } catch (err) {
    res.status(500).json({ message: "Failed to post audio tweet", error: err.message });
  }
});

module.exports = router;