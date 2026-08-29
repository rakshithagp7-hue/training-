const express = require("express");
const router = express.Router();
const User = require("../models/User");
const generateOtp = require("../utils/generateOtp");
const sendLanguageOtp = require("../utils/sendLanguageOtp");
const sendSmsOtp = require("../utils/sendSmsOtp");
const authMiddleware = require("../middleware/authMiddleware");

const VALID_LANGUAGES = ["en", "es", "hi", "pt", "zh", "fr"];

// Step A: Request OTP for language change
router.post("/language/request-otp", authMiddleware, async (req, res) => {
  try {
    const { language } = req.body;

    if (!VALID_LANGUAGES.includes(language)) {
      return res.status(400).json({ message: "Unsupported language selected." });
    }

    const otp = generateOtp();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const user = await User.findById(req.user._id);
    user.languageOtp = otp;
    user.languageOtpExpiry = expiry;
    await user.save();

    if (language === "fr") {
      // French requires OTP via email
      await sendLanguageOtp(user.email, otp);
      return res.json({ message: "OTP sent to your registered email.", via: "email" });
    } else {
      // All other languages require OTP via phone
      if (!user.phone) {
        return res.status(400).json({ message: "No phone number on file. Please add one to your profile first." });
      }
      await sendSmsOtp(user.phone, otp);
      return res.json({ message: "OTP sent to your registered mobile number.", via: "phone" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
});

// Step B: Verify OTP and apply language change
router.post("/language/verify-otp", authMiddleware, async (req, res) => {
  try {
    const { language, otp } = req.body;

    if (!VALID_LANGUAGES.includes(language)) {
      return res.status(400).json({ message: "Unsupported language selected." });
    }

    const user = await User.findById(req.user._id);

    if (!user.languageOtp || !user.languageOtpExpiry) {
      return res.status(400).json({ message: "No OTP request found. Please request one first." });
    }

    if (new Date() > user.languageOtpExpiry) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.languageOtp !== otp) {
  return res.status(400).json({ message: "Incorrect OTP." });
}

    // OTP correct — apply language change
    user.preferredLanguage = language;
    user.languageOtp = undefined;
    user.languageOtpExpiry = undefined;
    await user.save();

    res.json({ message: "Language changed successfully!", language });
  } catch (err) {
    res.status(500).json({ message: "Error verifying OTP", error: err.message });
  }
});

module.exports = router;